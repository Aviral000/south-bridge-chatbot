import { FileTreeItem } from "@/types";

export function findFileInTree(
  tree: FileTreeItem[],
  searchTerm: string
): FileTreeItem | null {
  for (const item of tree) {
    if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    }
    if (item.children) {
      const found = findFileInTree(item.children, searchTerm);
      if (found) return found;
    }
  }
  return null;
}

