import { BrandedSpinner } from '../components/NavigationLoader';

export default function TestLoadingPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Hero Section Skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Branded loading spinner */}
            <div className="mb-8">
              <BrandedSpinner size="lg" />
            </div>
            
            <div className="h-12 bg-white/60 rounded-lg mb-4 animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-6 bg-white/40 rounded-lg max-w-4xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Main demo card skeleton */}
          <div className="max-w-4xl mx-auto bg-white/80 rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6 w-64"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column skeleton */}
              <div className="space-y-6">
                <div className="h-6 bg-slate-200 rounded w-48"></div>
                
                {/* Component demo skeletons */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-lg">
                    <div className="h-5 bg-slate-200 rounded mb-4 w-32"></div>
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Right column skeleton */}
              <div className="space-y-6">
                <div className="h-6 bg-slate-200 rounded w-40"></div>
                
                {/* Interactive test skeletons */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-6 bg-blue-50 rounded-lg">
                    <div className="h-5 bg-blue-200 rounded mb-4 w-36"></div>
                    <div className="space-y-3">
                      <div className="h-10 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-10 bg-green-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feature cards skeleton */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4"></div>
                <div className="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Technical details skeleton */}
          <div className="mt-12 bg-white rounded-xl p-8 shadow-lg animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6 w-80"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="h-6 bg-slate-200 rounded mb-4 w-48"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="h-6 bg-slate-200 rounded mb-4 w-52"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <div className="h-6 bg-slate-200 rounded mb-3 w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-5 bg-green-200 rounded mb-2 w-40"></div>
                  <div className="space-y-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-slate-200 rounded w-5/6"></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-5 bg-blue-200 rounded mb-2 w-44"></div>
                  <div className="space-y-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-slate-200 rounded w-5/6"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-500/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-500/5 rounded-full animate-ping"></div>
      </div>
    </div>
  );
}
