import { getSiteSettings } from "../getSiteSettings";

export const metadata = {
  title: "Journals - Intelli Global Conferences",
  description: "Explore cutting-edge research, academic insights, and scholarly publications from our global network of experts and researchers.",
};

export default async function JournalsPage() {
  const siteSettings = await getSiteSettings();
  const journalMatter = siteSettings?.journal?.matterDescription;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            JOURNALS
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Explore cutting-edge research, academic insights, and scholarly publications 
            from our global network of experts and researchers.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            {journalMatter ? (
              <div className="text-xl md:text-2xl text-black max-w-4xl mx-auto leading-relaxed whitespace-pre-line text-center">
                {journalMatter}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Coming Soon
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Our journal section is currently under development. We're working to bring you 
                  the latest research papers, academic articles, and scholarly publications from 
                  conferences around the world.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
