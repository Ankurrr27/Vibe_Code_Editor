import type {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "@/modules/playground/lib/path-to-json";

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

export function transformToWebContainerFormat(
  template: TemplateFolder,
): WebContainerFileSystem {
  function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
    if ("folderName" in item) {
      // This is a directory
      const directoryContents: WebContainerFileSystem = {};
      
      item.items.forEach(subItem => {
        const key = "folderName" in subItem
          ? subItem.folderName
          : `${subItem.filename}.${subItem.fileExtension}`;
        directoryContents[key] = processItem(subItem);
      });

      return {
        directory: directoryContents
      };
    } else {
      // This is a file
      const fileItem = item as TemplateFile;
      return {
        file: {
          contents: fileItem.content
        }
      };
    }
  }

  const result: WebContainerFileSystem = {};
  
  template.items.forEach(item => {
    const key = "folderName" in item
      ? item.folderName
      : `${item.filename}.${item.fileExtension}`;
    result[key] = processItem(item);
  });

  return result;
}
