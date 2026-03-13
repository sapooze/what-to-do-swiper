import { useState } from "react";

interface Props {
  code: string;
}

export function RoomCodeDisplay({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
        Room Code
      </p>
      <p className="text-3xl font-black tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">{code}</p>
      <button
        onClick={copy}
        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 mx-auto"
      >
        {copied ? (
          <>
            <span>✓</span> Copied!
          </>
        ) : (
          <>
            <span>📋</span> Copy code
          </>
        )}
      </button>
    </div>
  );
}
