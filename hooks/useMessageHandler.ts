import { Message, FileTreeItem } from "@/types";
import { useChatCommands } from "./useChatCommands";
import { useAIChat } from "./useAIChat";

interface UseMessageHandlerProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedFile: FileTreeItem | null;
  setSelectedFile: (file: FileTreeItem | null) => void;
  clearHistory: () => Promise<boolean>;
}

export function useMessageHandler({
  messages,
  setMessages,
  selectedFile,
  setSelectedFile,
  clearHistory,
}: UseMessageHandlerProps) {
  const { processCommand } = useChatCommands({
    setMessages,
    setSelectedFile,
    clearHistory,
  });

  const { sendMessage } = useAIChat({
    setMessages,
    selectedFile,
  });

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if it's a command
    const isCommand = processCommand(content);
    if (isCommand) {
      return;
    }

    // Add reasoning message for file-related queries
    const lowerContent = content.toLowerCase().trim();
    const isFileQuery =
      lowerContent.includes("file") ||
      lowerContent.includes("open") ||
      lowerContent.includes("show") ||
      lowerContent.includes("view") ||
      /\.(js|jsx|ts|tsx|py|java|html|css|json)$/i.test(content);

    if (isFileQuery) {
      setTimeout(() => {
        const reasoningMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "reasoning",
          content: `The user wants to ${content.toLowerCase()}. Let me check the file tree and respond accordingly.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, reasoningMessage]);
      }, 300);
    }

    // Send to AI
    await sendMessage(content);
  };

  return { handleSendMessage };
}

