'use client';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Failed to load gallery</h2>
        <p className="text-gray-500 mt-2">{error.message}</p>
      </div>
    </div>
  );
}

