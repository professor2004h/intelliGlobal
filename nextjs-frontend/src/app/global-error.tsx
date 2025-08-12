"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error("Global Error:", error);
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-xl w-full bg-white border border-red-200 rounded-xl p-6 text-red-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4">An unexpected error occurred. You can try to recover.</p>
            <div className="flex gap-3">
              <button onClick={() => reset()} className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                Try Again
              </button>
            </div>
            <pre className="mt-4 text-xs whitespace-pre-wrap bg-red-50 rounded p-3 border border-red-100 overflow-auto">
              {error?.message}
              {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
            </pre>
          </div>
        </div>
      </body>
    </html>
  );
}

