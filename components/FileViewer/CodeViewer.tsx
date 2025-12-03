"use client";

import { FileTreeItem } from "@/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";

interface CodeViewerProps {
  file: FileTreeItem | null;
}

const getLanguageFromExtension = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    yml: "yaml",
    yaml: "yaml",
  };
  return languageMap[ext || ""] || "text";
};

export default function CodeViewer({ file }: CodeViewerProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!file || file.type !== "file" || !file.content) {
    return (
      <div className="flex h-full flex-1 flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-4 py-2.5">
          <p className="text-sm text-gray-600 dark:text-gray-400">No file selected</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Select a file to view its content</p>
        </div>
      </div>
    );
  }

  const language = file.language || getLanguageFromExtension(file.name);
  const lines = file.content.split("\n");

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-4 py-2.5">
        <p className="text-sm text-gray-600 dark:text-gray-400">{file.path}</p>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        <div className="flex">
          <div className="pr-4 text-right text-gray-400 dark:text-gray-600 select-none leading-[1.5] min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i} className="h-[1.5em]">{i + 1}</div>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto">
            <SyntaxHighlighter
              language={language}
              style={isDark ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                padding: 0,
                backgroundColor: "transparent",
                fontSize: "inherit",
                fontFamily: "inherit",
                lineHeight: "1.5",
              }}
              codeTagProps={{
                style: {
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                },
              }}
              PreTag="div"
            >
              {file.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
