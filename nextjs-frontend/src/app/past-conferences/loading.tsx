import { BrandedSpinner } from '../components/NavigationLoader';

export default function PastConferencesLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section Skeleton */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Branded loading spinner */}
          <div className="mb-8">
            <BrandedSpinner size="md" />
          </div>

          <div className="h-12 md:h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
          <div className="h-6 md:h-8 bg-white/10 rounded-lg max-w-4xl mx-auto mb-12 animate-pulse"></div>
          
          {/* Statistics Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="h-8 bg-white/20 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 -left-8 w-16 h-16 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Past Conferences Grid Skeleton */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 animate-pulse"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Enhanced Image Skeleton with shimmer */}
                <div className="h-56 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

                  {/* Date badge skeleton */}
                  <div className="absolute top-4 left-4 bg-white/80 rounded-lg px-3 py-2 shadow-lg">
                    <div className="h-4 bg-slate-300 rounded w-12 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-8 mt-1 animate-pulse"></div>
                  </div>

                  {/* Featured badge skeleton */}
                  <div className="absolute top-4 right-4 bg-slate-300 rounded-full px-3 py-1 animate-pulse">
                    <div className="h-4 bg-slate-400 rounded w-16"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Title Skeleton */}
                  <div className="h-6 bg-slate-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  
                  {/* Location Skeleton */}
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-slate-200 rounded mr-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                  </div>

                  {/* Stats Skeleton */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                  </div>

                  {/* Tags Skeleton */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, tagIndex) => (
                      <div key={tagIndex} className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                    ))}
                  </div>

                  {/* Button Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
