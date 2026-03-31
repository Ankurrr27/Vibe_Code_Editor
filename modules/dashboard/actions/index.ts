"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";
import type {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "@/modules/playground/lib/path-to-json";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type PlaygroundTemplate =
  | "REACT"
  | "NEXTJS"
  | "EXPRESS"
  | "VUE"
  | "HONO"
  | "ANGULAR";

interface GitHubRepoResponse {
  name: string;
  description: string | null;
  default_branch: string;
  private: boolean;
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
  url: string;
}

const githubApiBase = "https://api.github.com";

const buildGithubHeaders = (token?: string) => ({
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const normalizeDirectoryPath = (value?: string) =>
  value?.trim().replace(/^\/+|\/+$/g, "") ?? "";

const parseGithubRepositoryUrl = (repositoryUrl: string) => {
  let url: URL;

  try {
    url = new URL(repositoryUrl);
  } catch {
    throw new Error("Enter a valid GitHub repository URL");
  }

  if (url.hostname !== "github.com") {
    throw new Error("Only GitHub repository URLs are supported");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error("Use a repository URL like https://github.com/owner/repo");
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/, "");

  let branch: string | undefined;
  let directoryPath = "";

  if (segments[2] === "tree") {
    branch = segments[3];
    directoryPath = segments.slice(4).join("/");
  }

  return {
    owner,
    repo,
    branch,
    directoryPath,
  };
};

const fetchGithubJson = async <T>(url: string, token?: string): Promise<T> => {
  const response = await fetch(url, {
    headers: buildGithubHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "GitHub access was denied. Connect your GitHub account and try again.",
      );
    }

    if (response.status === 404) {
      throw new Error(
        "Repository or directory not found. Double-check the GitHub URL and directory path.",
      );
    }

    throw new Error(`GitHub request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};

const fetchGithubFileContent = async (
  file: GitHubContentItem,
  token?: string,
): Promise<string> => {
  if (file.download_url) {
    const response = await fetch(file.download_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });

    if (response.ok) {
      return response.text();
    }
  }

  const response = await fetch(file.url, {
    headers: {
      ...buildGithubHeaders(token),
      Accept: "application/vnd.github.raw",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch file content for ${file.path}`);
  }

  return response.text();
};

const mapGithubItemsToTemplate = async (
  owner: string,
  repo: string,
  ref: string,
  currentPath: string,
  folderName: string,
  token?: string,
): Promise<TemplateFolder> => {
  const encodedPath = currentPath
    ? `/${currentPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`
    : "";
  const contentsUrl = `${githubApiBase}/repos/${owner}/${repo}/contents${encodedPath}?ref=${encodeURIComponent(ref)}`;
  const items = await fetchGithubJson<GitHubContentItem[]>(contentsUrl, token);

  const templateItems: TemplateItem[] = [];

  for (const item of items.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }

    return a.type === "dir" ? -1 : 1;
  })) {
    if (item.type === "dir") {
      templateItems.push(
        await mapGithubItemsToTemplate(
          owner,
          repo,
          ref,
          item.path,
          item.name,
          token,
        ),
      );
      continue;
    }

    const extensionIndex = item.name.lastIndexOf(".");
    const fileName =
      extensionIndex > -1 ? item.name.slice(0, extensionIndex) : item.name;
    const fileExtension =
      extensionIndex > -1 ? item.name.slice(extensionIndex + 1) : "";
    const content = await fetchGithubFileContent(item, token);

    templateItems.push({
      filename: fileName,
      fileExtension,
      content,
    } satisfies TemplateFile);
  }

  return {
    folderName,
    items: templateItems,
  };
};

const findTemplateFile = (
  folder: TemplateFolder,
  matcher: (file: TemplateFile) => boolean,
): TemplateFile | null => {
  for (const item of folder.items) {
    if ("folderName" in item) {
      const nested = findTemplateFile(item, matcher);
      if (nested) return nested;
      continue;
    }

    if (matcher(item)) {
      return item;
    }
  }

  return null;
};

const detectTemplateFromRepository = (
  folder: TemplateFolder,
): PlaygroundTemplate => {
  const angularConfig = findTemplateFile(
    folder,
    (file) => file.filename === "angular" && file.fileExtension === "json",
  );

  if (angularConfig) {
    return "ANGULAR";
  }

  const packageJsonFile = findTemplateFile(
    folder,
    (file) => file.filename === "package" && file.fileExtension === "json",
  );

  if (!packageJsonFile) {
    return "REACT";
  }

  try {
    const packageJson = JSON.parse(packageJsonFile.content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (dependencies.next) return "NEXTJS";
    if (dependencies["@angular/core"]) return "ANGULAR";
    if (dependencies.express) return "EXPRESS";
    if (dependencies.vue) return "VUE";
    if (dependencies.hono) return "HONO";
    if (dependencies.react) return "REACT";
  } catch (error) {
    console.error("Failed to detect imported repository template:", error);
  }

  return "REACT";
};

export const connectGithubForImport = async () => {
  await signIn("github", { redirectTo: DEFAULT_LOGIN_REDIRECT });
};

export const importGithubRepository = async (data: {
  repositoryUrl: string;
  directory?: string;
  title?: string;
}) => {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("You need to sign in before importing a repository");
  }

  const githubAccount = await db.account.findFirst({
    where: {
      userId: user.id,
      provider: "github",
    },
  });

  const githubToken =
    typeof githubAccount?.access_token === "string"
      ? githubAccount.access_token
      : undefined;

  const parsedRepository = parseGithubRepositoryUrl(data.repositoryUrl);
  const repoResponse = await fetchGithubJson<GitHubRepoResponse>(
    `${githubApiBase}/repos/${parsedRepository.owner}/${parsedRepository.repo}`,
    githubToken,
  );

  const directoryPath = normalizeDirectoryPath(
    data.directory || parsedRepository.directoryPath,
  );
  const ref = parsedRepository.branch || repoResponse.default_branch;
  const folderName = directoryPath
    ? directoryPath.split("/").pop() || parsedRepository.repo
    : parsedRepository.repo;

  const templateData = await mapGithubItemsToTemplate(
    parsedRepository.owner,
    parsedRepository.repo,
    ref,
    directoryPath,
    folderName,
    githubToken,
  );

  const template = detectTemplateFromRepository(templateData);
  const playground = await db.playground.create({
    data: {
      title: data.title?.trim() || folderName,
      description:
        repoResponse.description ||
        `Imported from ${parsedRepository.owner}/${parsedRepository.repo}`,
      template,
      userId: user.id,
    },
  });

  await db.templateFile.create({
    data: {
      playgroundId: playground.id,
      content: JSON.parse(JSON.stringify(templateData)),
    },
  });

  revalidatePath("/dashboard");

  return {
    success: true,
    playgroundId: playground.id,
  };
};

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean,
) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User Id is required");
  }
  try {
    if (isChecked) {
      await db.starMark.create({
        data: {
          userId: userId!,
          playgroundId,
          isMarked: isChecked,
        },
      });
    } else {
      await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId,
          },
        },
      });
    }
    revalidatePath("/dashboard");
    return { success: true, isMarked: isChecked };
  } catch (error) {
    console.log(error);
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();
  if (!user?.id) {
    return [];
  }

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        Starmark: {
          where:{
            userId:user.id
          },
          select:{
            isMarked:true
          }
        }
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User Id is required");
  }

  const { template, title, description } = data;

  try {
    const playground = await db.playground.create({
      data: {
        title: title,
        description: description,
        template: template,
        userId: user.id,
      },
    });
    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await db.playground.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string },
) => {
  try {
    await db.playground.update({
      where: {
        id,
      },
      data: data,
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo
    });
    if (!originalPlayground) {
      throw new Error("Original playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,

        // todo : add template files
      },
    });

    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.log(error);
  }
};
