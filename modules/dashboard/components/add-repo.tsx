"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  FolderTree,
  Github,
  Link2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectGithubForImport,
  importGithubRepository,
} from "@/modules/dashboard/actions";

const AddRepo = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [directory, setDirectory] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleImport = () => {
    if (!repoUrl.trim()) {
      toast.error("Paste a GitHub repository URL to continue");
      return;
    }

    startTransition(async () => {
      try {
        const result = await importGithubRepository({
          repositoryUrl: repoUrl.trim(),
          directory: directory.trim(),
          title: projectTitle.trim(),
        });

        if (!result?.playgroundId) {
          throw new Error("Repository import did not return a playground");
        }

        toast.success("Repository imported successfully");
        setOpen(false);
        router.push(`/playground/${result.playgroundId}`);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to import repository";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="group flex cursor-pointer flex-row items-center justify-between rounded-lg border bg-muted px-6 py-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-[#E93F3F] hover:bg-background shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
        >
          <div className="flex flex-row items-start justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center bg-white transition-colors duration-300 group-hover:border-[#E93F3F] group-hover:bg-[#fff8f8] group-hover:text-[#E93F3F]"
              size="icon"
            >
              <ArrowDown
                size={30}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#e93f3f]">
                Open GitHub Repository
              </h1>
              <p className="max-w-[260px] text-sm text-muted-foreground">
                Connect GitHub and import a repository or a specific folder
                directly into the editor.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <Image
              src="/github.svg"
              alt="Open GitHub repository"
              width={150}
              height={150}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden border-white/10 bg-zinc-950 text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white">
            <div className="rounded-2xl bg-[#e93f3f]/15 p-2 text-[#ff8f8f]">
              <Github className="h-5 w-5" />
            </div>
            Import From GitHub
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Connect GitHub once, then paste any repository URL. You can also
            target a subdirectory like <span className="text-zinc-200">apps/web</span>
            {" "}to import just that folder.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Connect your GitHub account
                </p>
                <p className="text-xs text-zinc-400">
                  This enables repository access and private repo imports when your
                  GitHub account is linked.
                </p>
              </div>

              <form action={connectGithubForImport}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-[#e93f3f]/35 bg-[#e93f3f]/10 text-[#ffb1b1] hover:bg-[#e93f3f]/20"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
              </form>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="repo-url" className="text-zinc-200">
                Repository URL
              </Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="repo-url"
                  value={repoUrl}
                  onChange={(event) => setRepoUrl(event.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="repo-directory" className="text-zinc-200">
                  Directory
                </Label>
                <div className="relative">
                  <FolderTree className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="repo-directory"
                    value={directory}
                    onChange={(event) => setDirectory(event.target.value)}
                    placeholder="apps/web"
                    className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="project-title" className="text-zinc-200">
                  Project Title
                </Label>
                <Input
                  id="project-title"
                  value={projectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                  placeholder="Optional custom title"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-zinc-400">
            Supported examples:
            <div className="mt-2 space-y-1 text-zinc-300">
              <p>https://github.com/vercel/next.js</p>
              <p>https://github.com/vercel/next.js/tree/canary/examples/with-supabase</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isPending}
            className="bg-[#e93f3f] text-white hover:bg-[#d63636]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                Import Repository
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepo;
