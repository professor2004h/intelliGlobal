export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border rounded-xl p-6 text-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Page not found</h2>
        <p className="text-sm">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="inline-block mt-4 text-blue-600 underline">Go Home</a>
      </div>
    </div>
  );
}

