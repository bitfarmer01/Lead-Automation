import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-md relative group">
      <pre className="p-4 text-sm text-slate-800 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {isCopied ? (
          <CheckIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : (
          <CopyIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}