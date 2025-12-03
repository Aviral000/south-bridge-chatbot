import { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

const avatarUrls = {
  assistant: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1NmCtB-35EjlpijJozUiZcX80Ip59IJLUOy8bUPbTzxc2gIgUg3CxNh1gwFs1WRKPySPMF4fz7uZLJColIqxFgKnwMoJmbJzYg5vrsNa0VYcKeNU0xVoIkjF-iaLRMzpQX_jQb0Cp2-Q4rVc9Ibu2wwBw3-Ihj93KFpnhHbFrqJgfRe0Aha8u3lRug2s5JXtb929UZtWUvKDEtw4dDSbDX1IE8k3OGyQTO-tUltB2nNiDR_UBmxAeFfVC7AM9hJFyNB0THOCHNYc",
  user: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVh8UGzNojpUAQVFIT9XR3-Lm3qkTkrq-EBufcn80RYeHrMRxSiTa3WyKOo8epsksaCmpYl7ZDBV5yV5oZCap4J0ggpoEIDGSUkRifAmp6I3qM1wyrdzlziRZ1FIVrRdrZ_OUPx-DlbL4PHgeQw1-37fBXMRFJQ3Go21EAvbC9dbaoUFSPtwTVvTfEqgq4l7uhNEyZkuPrLbqvR2WKKeDqp_idJepP5uF7_dNMsDcwemU4psIdTBos_dBxI6a56j1jOuVV3hh2JAs",
  reasoning: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeBtIT5TNL_GU1buexn-A6Olif4n7wsPwW2cfhDbgcZF3kE0C_jRquhCCXHIXnsfcpj4iVsP7HkzRsdCMkxUX3NUREm2K2pJVs7xMSwZ1kBrpU8FzoDOz51XpH2-ofDqgmwLGJ_5HS6LjVR6ti3438MB50BYt99Zluuju7S9nmYqAf6KMeJ6kJjJ-k-UBLHsTB28LYkI_6HWLJWG-qHNYekuUJ1bIrPmSDi3xTrwQLckvmLY_jhhv-hBOIFZt8noXJo1jltGntE8A",
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  const isReasoning = message.type === "reasoning";
  const avatarUrl = avatarUrls[message.type];

  return (
    <div className={`flex items-end gap-3 p-0 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
          style={{ backgroundImage: `url("${avatarUrl}")` }}
        />
      )}
      <div className={`flex flex-1 flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <p
          className={`text-gray-500 dark:${
            isReasoning ? "text-yellow-400" : "text-[#90b4cb]"
          } text-sm font-normal leading-normal max-w-[360px] ${isUser ? "text-right" : ""}`}
        >
          {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
        </p>
        <p
          className={`text-base font-normal leading-normal max-w-[360px] rounded-lg px-4 py-3 break-words ${
            isUser
              ? "bg-primary/20 dark:bg-primary text-gray-900 dark:text-background-dark"
              : isReasoning
              ? "bg-yellow-100 dark:bg-yellow-900/40 text-gray-800 dark:text-yellow-200 italic"
              : "bg-gray-100 dark:bg-[#223a49] text-gray-900 dark:text-white"
          }`}
        >
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </p>
      </div>
      {isUser && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
          style={{ backgroundImage: `url("${avatarUrl}")` }}
        />
      )}
    </div>
  );
}

