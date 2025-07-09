export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Test Page - Server is Working! ✅
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This confirms the Next.js server is running properly.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
            <h2 className="font-semibold text-green-800">✅ Frontend Server</h2>
            <p className="text-green-700">Running on http://localhost:3000</p>
          </div>
          <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
            <h2 className="font-semibold text-blue-800">🎨 CSS Styles</h2>
            <p className="text-blue-700">Tailwind CSS is working properly</p>
          </div>
          <div className="p-4 bg-purple-100 border border-purple-400 rounded-lg">
            <h2 className="font-semibold text-purple-800">⚛️ React Components</h2>
            <p className="text-purple-700">React rendering is functional</p>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Back to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
