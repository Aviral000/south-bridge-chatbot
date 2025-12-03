"use client";

import { useState } from "react";
import { FileTreeItem } from "@/types";
import FileTreeItemComponent from "./FileTreeItem";

interface FileSidebarProps {
  files: FileTreeItem[];
  selectedFile: FileTreeItem | null;
  onFileSelect: (file: FileTreeItem) => void;
}

export default function FileSidebar({
  files,
  selectedFile,
  onFileSelect,
}: FileSidebarProps) {
  return (
    <div className="h-full w-[260px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark overflow-y-auto">
      <div className="p-2 space-y-1">
        {files.map((item) => (
          <FileTreeItemComponent
            key={item.path}
            item={item}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

