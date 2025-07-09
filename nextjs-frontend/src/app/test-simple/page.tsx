export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Simple Test Page
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        This is a simple test page to verify Next.js is working.
      </p>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        ✅ If you can see this page, Next.js is running successfully!
      </div>
    </div>
  );
}
