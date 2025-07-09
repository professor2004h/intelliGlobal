import { BrandedSpinner } from '../../components/NavigationLoader';

export default function PastConferenceDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section Skeleton */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Branded loading spinner */}
            <div className="mb-8">
              <BrandedSpinner size="lg" />
            </div>

            {/* Featured Badge Skeleton */}
            <div className="inline-flex h-8 w-32 bg-white/20 rounded-full mb-4 animate-pulse"></div>
            
            {/* Title Skeleton */}
            <div className="h-12 md:h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            
            {/* Date and Location Skeleton */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="h-6 w-48 bg-white/10 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="h-6 bg-white/10 rounded max-w-4xl mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-8 w-32 h-32 bg-orange-500/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Conference Stats Skeleton */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="h-8 bg-slate-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Description Section */}
              <div className="mb-12">
                <div className="h-8 bg-slate-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Key Speakers Section */}
              <div className="mb-12">
                <div className="h-8 bg-slate-200 rounded mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-slate-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-4 bg-slate-200 rounded mb-2 w-3/4 animate-pulse"></div>
                          <div className="h-3 bg-slate-200 rounded mb-2 w-1/2 animate-pulse"></div>
                          <div className="space-y-1">
                            <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conference Outcomes Section */}
              <div className="mb-12">
                <div className="h-8 bg-slate-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="mb-12">
                <div className="h-8 bg-slate-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-6">
                      <div className="space-y-3 mb-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
                      </div>
                      <div className="flex items-center">
                        <div>
                          <div className="h-4 bg-slate-200 rounded mb-1 w-32 animate-pulse"></div>
                          <div className="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Conference Highlights */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
                <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-slate-200 rounded mr-3 mt-0.5 animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Covered */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
                <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Back to Past Conferences */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="h-5 bg-white/20 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded mb-4 animate-pulse"></div>
                <div className="h-10 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section Skeleton */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-slate-200 rounded mb-8 text-center max-w-md mx-auto animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-square bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
