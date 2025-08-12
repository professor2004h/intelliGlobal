"use client";

import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to help with diagnostics
    console.error("App Router Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Something went wrong</h2>
            <p className="text-sm mb-4">
              This component encountered an error. You can try again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowDetails((s) => !s)}
                className="text-sm underline"
              >
                {showDetails ? "Hide details" : "Error details"}
              </button>
            </div>
            {showDetails && (
              <pre className="mt-4 text-xs whitespace-pre-wrap bg-white/70 rounded p-3 border border-red-100 overflow-auto">
                {error?.message}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

