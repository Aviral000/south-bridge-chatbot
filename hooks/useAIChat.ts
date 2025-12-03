import { Message, FileTreeItem } from "@/types";

interface UseAIChatProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedFile: FileTreeItem | null;
}

export function useAIChat({ setMessages, selectedFile }: UseAIChatProps) {
  const sendMessage = async (content: string) => {
    // Build file context if a file is selected
    const fileContext = selectedFile
      ? `Current file: ${selectedFile.path}\nContent:\n${selectedFile.content}`
      : null;

    // Create streaming message
    const assistantMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          fileContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                accumulatedText += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMessage = updated[updated.length - 1];
                  if (lastMessage) {
                    updated[updated.length - 1] = {
                      ...lastMessage,
                      content: accumulatedText,
                      isStreaming: true,
                    };
                  }
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage) {
          updated[updated.length - 1] = {
            ...lastMessage,
            isStreaming: false,
          };
        }
        return updated;
      });
    } catch (error: any) {
      console.error("API error:", error);
      const errorMessage = error.message || "Unknown error";
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage) {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: `I'm having trouble connecting to the AI service.\n\nError: ${errorMessage}\n\nPlease check:\n1. Your GEMINI_API_KEY is set in .env.local\n2. You've restarted the dev server after adding the key\n3. Check the server console for more details`,
            isStreaming: false,
          };
        }
        return updated;
      });
    }
  };

  return { sendMessage };
}

