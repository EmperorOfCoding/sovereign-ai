'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 text-white text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-4 uppercase tracking-tighter">System Crash Detected</h2>
      <p className="text-zinc-400 mb-8 max-w-md font-mono text-sm">
        {error.message || 'An unexpected runtime error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-primary text-black font-bold rounded hover:bg-[#2ee600] transition-all uppercase tracking-widest text-xs"
      >
        Attempt Reboot
      </button>
    </div>
  );
}
