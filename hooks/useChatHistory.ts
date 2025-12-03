import { useState, useEffect } from "react";
import { Message } from "@/types";
import { mockMessages } from "@/data/mockData";

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const clearHistory = async () => {
    try {
      const response = await fetch("/api/chat/history", {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages(mockMessages);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to clear history:", error);
      return false;
    }
  };

  return {
    messages,
    setMessages,
    isLoadingHistory,
    clearHistory,
  };
}

