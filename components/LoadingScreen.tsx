export default function LoadingScreen() {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111827] dark:text-white items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Loading chat history...</p>
    </div>
  );
}

