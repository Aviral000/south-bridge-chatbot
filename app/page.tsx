"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import FileViewer from "@/components/FileViewer";
import LoadingScreen from "@/components/LoadingScreen";
import { FileTreeItem } from "@/types";
import { mockFileTree } from "@/data/mockData";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useMessageHandler } from "@/hooks/useMessageHandler";

export default function Home() {
  const { messages, setMessages, isLoadingHistory, clearHistory } =
    useChatHistory();
  const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(
    mockFileTree[0]?.children?.[0]?.children?.[0] || null
  );

  const { handleSendMessage } = useMessageHandler({
    messages,
    setMessages,
    selectedFile,
    setSelectedFile,
    clearHistory,
  });

  if (isLoadingHistory) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111827] dark:text-white group/design-root overflow-hidden">
      <div className="flex h-full w-full">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearHistory={clearHistory}
        />
        <FileViewer
          files={mockFileTree}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />
      </div>
    </div>
  );
}

