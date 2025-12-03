export type MessageType = "user" | "assistant" | "reasoning";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface FileTreeItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileTreeItem[];
  content?: string;
  language?: string;
}

