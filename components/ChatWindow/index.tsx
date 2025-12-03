"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ScrollToBottomButton from "./ScrollToBottomButton";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClearHistory?: () => void;
}

export default function ChatWindow({ messages, onSendMessage, onClearHistory }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkIfAtBottom);
    return () => container.removeEventListener("scroll", checkIfAtBottom);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  return (
    <div className="flex h-full w-1/2 flex-col border-r border-gray-200 dark:border-gray-800 relative">
      {onClearHistory && messages.length > 0 && (
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex justify-end">
          <button
            onClick={onClearHistory}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Clear chat history"
          >
            Clear History
          </button>
        </div>
      )}
      <div className="relative flex-1 overflow-y-auto" ref={messagesContainerRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {!isAtBottom && (
        <div className="absolute bottom-20 right-5 z-20">
          <ScrollToBottomButton onClick={scrollToBottom} />
        </div>
      )}
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}

