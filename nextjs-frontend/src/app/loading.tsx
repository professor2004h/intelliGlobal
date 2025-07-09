import { BrandedSpinner } from './components/NavigationLoader';

export default function Loading() {
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

            <div className="h-16 md:h-20 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-8 bg-white/10 rounded-lg max-w-4xl mx-auto mb-12 animate-pulse"></div>

            {/* CTA buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-48 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-8 w-32 h-32 bg-orange-500/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Statistics Section Skeleton */}
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
    </div>
  );
}
