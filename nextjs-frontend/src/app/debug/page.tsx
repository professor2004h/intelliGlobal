export default function DebugPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Hero Section Test */}
      <section className="hero-section relative h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="relative z-10 text-center text-white">
          <h1 className="hero-welcome-text text-4xl md:text-6xl font-bold mb-4">
            Welcome to Intelli Global Conferences
          </h1>
          <p className="hero-subtitle-text text-lg md:text-xl mb-8 max-w-4xl mx-auto">
            A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING
          </p>
          
          {/* Test Mobile Button Layout */}
          <div className="hero-buttons-container">
            <a
              href="/conferences"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all duration-300"
            >
              VIEW ALL CONFERENCES
            </a>
            <a
              href="/contact"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-all duration-300"
            >
              CONTACT US
            </a>
          </div>
        </div>
      </section>

      {/* Simple Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Debug Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Server Status</h3>
              <p className="text-green-700">Next.js development server is running</p>
            </div>
            
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎨 CSS Status</h3>
              <p className="text-blue-700">Mobile hero fixes have been applied</p>
            </div>
            
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">📱 Mobile Test</h3>
              <p className="text-purple-700">Resize browser to test mobile layout</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-4">🔧 Mobile Hero Section Fixes Applied:</h3>
            <ul className="text-left text-yellow-700 space-y-2 max-w-2xl mx-auto">
              <li>✅ Navigation dots hidden on mobile (320px-640px)</li>
              <li>✅ Buttons display in vertical stack on mobile</li>
              <li>✅ Buttons have proper touch targets (48px+ height)</li>
              <li>✅ Text content properly centered</li>
              <li>✅ Professional button styling with shadows</li>
              <li>✅ No layout overflow or horizontal scrolling</li>
            </ul>
          </div>

          <div className="mt-8">
            <a 
              href="/" 
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mr-4"
            >
              Back to Home Page
            </a>
            <a 
              href="/test" 
              className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Simple Test Page
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
