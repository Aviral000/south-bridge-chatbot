"use client";

import { FileTreeItem } from "@/types";
import FileSidebar from "./FileSidebar";
import CodeViewer from "./CodeViewer";

interface FileViewerProps {
  files: FileTreeItem[];
  selectedFile: FileTreeItem | null;
  onFileSelect: (file: FileTreeItem) => void;
}

export default function FileViewer({
  files,
  selectedFile,
  onFileSelect,
}: FileViewerProps) {
  return (
    <div className="flex h-full w-1/2">
      <FileSidebar files={files} selectedFile={selectedFile} onFileSelect={onFileSelect} />
      <CodeViewer file={selectedFile} />
    </div>
  );
}

