import { BrandedSpinner } from '../components/NavigationLoader';

export default function ConferencesLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section Skeleton */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Branded loading spinner */}
            <div className="mb-8">
              <BrandedSpinner size="md" />
            </div>
            
            <div className="h-12 md:h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 md:h-8 bg-white/10 rounded-lg max-w-4xl mx-auto mb-12 animate-pulse"></div>
            
            {/* Search bar skeleton */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Filter buttons skeleton */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-10 w-24 bg-white/10 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Conference Cards Grid Skeleton */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Image Skeleton with shimmer */}
                <div className="h-56 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  
                  {/* Status badge skeleton */}
                  <div className="absolute top-4 left-4 bg-green-200 rounded-full px-3 py-1 animate-pulse">
                    <div className="h-4 bg-green-400 rounded w-20"></div>
                  </div>
                  
                  {/* Date badge skeleton */}
                  <div className="absolute top-4 right-4 bg-white/80 rounded-lg px-3 py-2 shadow-lg">
                    <div className="h-4 bg-slate-300 rounded w-16 animate-pulse"></div>
                  </div>
                </div>

                {/* Enhanced Content Skeleton */}
                <div className="p-6">
                  {/* Title skeleton */}
                  <div className="h-6 bg-slate-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded mb-4 w-3/4 animate-pulse"></div>
                  
                  {/* Location skeleton */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                  </div>
                  
                  {/* Date skeleton */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                  </div>
                  
                  {/* Description skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                  </div>
                  
                  {/* Tags skeleton */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-14 animate-pulse"></div>
                  </div>
                  
                  {/* Buttons skeleton */}
                  <div className="flex gap-3">
                    <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg flex-1 animate-pulse"></div>
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg flex-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load more button skeleton */}
          <div className="text-center mt-12">
            <div className="h-12 w-48 bg-slate-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
