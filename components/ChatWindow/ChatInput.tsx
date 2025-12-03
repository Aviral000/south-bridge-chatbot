"use client";

import { useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const avatarUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdOt7NYrtiIZhkWI4NjuZylIpfjkIzgHrXyqJC4lpGy_TcfasC-QiXcLY2VE-EpqKm0PMZi_OzIDcCpFr4Q5tOS0GUZ0qOlfsqGLbjtpw3TrAJwjAqHQXlLXLx2lITkbO1hGwgpjMgaikFM7IKCgb_-NMFrwitS0ejHKp2AjsPck3z5Ss-NvQ_Tgl7v0EKC8wGr_nCZtHeCFohXj7Luy6vzneLSn3Y3KX-HPqlsFEXA61V_dcEsfEg_KoM53g5RkjDoW_kUva-mg";

  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
          style={{ backgroundImage: `url("${avatarUrl}")` }}
        />
        <label className="flex flex-col min-w-40 h-12 flex-1">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-200 dark:bg-[#223a49] focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-[#90b4cb] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
              placeholder="Type your message..."
            />
            <div className="flex border-none bg-gray-200 dark:bg-[#223a49] items-center justify-center pr-4 rounded-r-lg border-l-0 !pr-2">
              <div className="flex items-center gap-4 justify-end">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="flex items-center justify-center p-1.5 text-gray-500 dark:text-[#90b4cb] hover:text-gray-700 dark:hover:text-white"
                  >
                    <MdAttachFile className="text-xl" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center p-1.5 text-gray-500 dark:text-[#90b4cb] hover:text-gray-700 dark:hover:text-white md:hidden"
                  >
                    <MdSend className="text-xl" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-background-dark text-sm font-medium leading-normal hidden md:flex hover:bg-primary/90"
                >
                  <span className="truncate">Send</span>
                </button>
              </div>
            </div>
          </div>
        </label>
      </form>
    </div>
  );
}

