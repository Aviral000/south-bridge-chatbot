import { Message, FileTreeItem } from "@/types";
import { mockFileTree } from "@/data/mockData";
import { findFileInTree } from "@/utils/fileTree";

interface UseChatCommandsProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectedFile: (file: FileTreeItem | null) => void;
  clearHistory: () => Promise<boolean>;
}

export function useChatCommands({
  setMessages,
  setSelectedFile,
  clearHistory,
}: UseChatCommandsProps) {
  const handleClearCommand = async () => {
    setTimeout(() => {
      const reasoningMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "reasoning",
        content: `The user wants to clear the chat history. I will delete all previous messages and start fresh.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reasoningMessage]);
    }, 300);

    setTimeout(async () => {
      const success = await clearHistory();
      if (!success) {
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: `Failed to clear history. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    }, 800);
  };

  const handleReadCommand = (fileName: string) => {
    const foundFile = findFileInTree(mockFileTree, fileName);

    if (foundFile && foundFile.type === "file") {
      setSelectedFile(foundFile);
      setTimeout(() => {
        const reasoningMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "reasoning",
          content: `The user wants to read "${fileName}". I will locate the file in the file tree and display its content.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reasoningMessage]);
      }, 300);

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: `I've opened \`${foundFile.path}\` for you. The file is now displayed on the right side.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 800);
      return true;
    } else {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `I couldn't find a file named "${fileName}". Available files include: App.js, Header.js, and index.js. Try: "read App.js"`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 500);
      return false;
    }
  };

  const processCommand = (content: string): boolean => {
    const lowerContent = content.toLowerCase().trim();

    // Handle "clear" command
    if (lowerContent === "clear" || lowerContent === "clear history") {
      handleClearCommand();
      return true;
    }

    // Handle "read" command
    const readCommandMatch = lowerContent.match(/^read\s+(.+)$/);
    if (readCommandMatch) {
      const fileName = readCommandMatch[1].trim();
      return handleReadCommand(fileName);
    }

    return false;
  };

  return { processCommand };
}

