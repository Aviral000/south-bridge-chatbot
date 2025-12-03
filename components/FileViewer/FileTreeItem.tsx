"use client";

import { useState } from "react";
import { FileTreeItem as FileTreeItemType } from "@/types";
import { 
  MdChevronRight, 
  MdExpandMore, 
  MdFolder, 
  MdFolderOpen,
  MdDescription 
} from "react-icons/md";

interface FileTreeItemProps {
  item: FileTreeItemType;
  selectedFile: FileTreeItemType | null;
  onFileSelect: (file: FileTreeItemType) => void;
  level: number;
}

export default function FileTreeItemComponent({
  item,
  selectedFile,
  onFileSelect,
  level,
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const isSelected = selectedFile?.path === item.path;
  const isDirectory = item.type === "directory";
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(item);
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors ${
          isSelected
            ? "bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-100 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {isDirectory ? (
          <>
            <span className="flex-shrink-0 w-6 flex items-center justify-center">
              {isExpanded ? (
                <MdExpandMore className="text-base" />
              ) : (
                <MdChevronRight className="text-base" />
              )}
            </span>
            <span className="flex-shrink-0 text-sky-400">
              {isExpanded ? (
                <MdFolderOpen className="text-base" />
              ) : (
                <MdFolder className="text-base" />
              )}
            </span>
          </>
        ) : (
          <>
            <span className="w-6 flex-shrink-0"></span>
            <span className="flex-shrink-0 text-yellow-500">
              <MdDescription className="text-base" />
            </span>
          </>
        )}
        <span className="truncate">{item.name}</span>
      </div>
      {isDirectory && isExpanded && hasChildren && (
        <div className="space-y-1">
          {item.children!.map((child) => (
            <FileTreeItemComponent
              key={child.path}
              item={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

