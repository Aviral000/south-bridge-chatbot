"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import FileViewer from "@/components/FileViewer";
import { Message, FileTreeItem } from "@/types";
import { mockMessages, mockFileTree } from "@/data/mockData";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileTreeItem | null>(
    mockFileTree[0]?.children?.[0]?.children?.[0] || null
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch("/api/chat/history");
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Convert timestamp strings back to Date objects
            const loadedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(loadedMessages);
          } else {
            // If no history, use mock messages
            setMessages(mockMessages);
          }
        } else {
          // Fallback to mock messages
          setMessages(mockMessages);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        setMessages(mockMessages);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (!isLoadingHistory && messages.length > 0) {
      const saveHistory = async () => {
        try {
          await fetch("/api/chat/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages }),
          });
        } catch (error) {
          console.error("Failed to save history:", error);
        }
      };

      // Debounce saves to avoid too many writes
      const timeoutId = setTimeout(saveHistory, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoadingHistory]);

  // Clear chat history function
  const clearHistory = async () => {
    try {
      const response = await fetch("/api/chat/history", {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const findFileInTree = (tree: FileTreeItem[], searchTerm: string): FileTreeItem | null => {
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
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check for commands (e.g., "read filename.js", "read App.js", "clear")
    const lowerContent = content.toLowerCase().trim();
    
    // Handle "clear" command
    if (lowerContent === "clear" || lowerContent === "clear history") {
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
        try {
          const response = await fetch("/api/chat/history", {
            method: "DELETE",
          });
          if (response.ok) {
            // Start completely fresh with just mock messages
            setMessages(mockMessages);
          } else {
            const assistantMessage: Message = {
              id: (Date.now() + 2).toString(),
              type: "assistant",
              content: `Failed to clear history. Please try again.`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
        } catch (error) {
          console.error("Failed to clear history:", error);
          const assistantMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: `Failed to clear history. Please try again.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      }, 800);
      return;
    }
    
    // Handle "read" command
    const readCommandMatch = lowerContent.match(/^read\s+(.+)$/);
    
    if (readCommandMatch) {
      const fileName = readCommandMatch[1].trim();
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
        return;
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
        return;
      }
    }

    // Simulate reasoning message for file-related queries
    const isFileQuery = lowerContent.includes("file") || 
                       lowerContent.includes("open") || 
                       lowerContent.includes("show") ||
                       lowerContent.includes("view") ||
                       /\.(js|jsx|ts|tsx|py|java|html|css|json)$/i.test(content);

    if (isFileQuery) {
      // Add reasoning message
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

    // Call Gemini API for AI response
    const assistantMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // Build file context if a file is selected
    const fileContext = selectedFile 
      ? `Current file: ${selectedFile.path}\nContent:\n${selectedFile.content}`
      : null;

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
      // Fallback to mock response if API fails
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

  if (isLoadingHistory) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111827] dark:text-white items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading chat history...</p>
      </div>
    );
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

