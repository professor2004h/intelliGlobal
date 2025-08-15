import type { Metadata } from 'next';
import Image from 'next/image';
import { client } from '../sanity/client';
import { getImageUrl } from '../getSiteSettings';

// Types
interface GalleryImageItem {
  _key: string;
  image?: { asset?: { url?: string } };
  alt?: string;
  caption?: string;
  tags?: string[];
}

interface GalleryPageData {
  _id: string;
  heroBackgroundImage?: { asset?: { url?: string } };
  heroTitle: string;
  heroSubtitle?: string;
  heroOverlayOpacity?: number; // 0-100
  galleryImages?: GalleryImageItem[];
}

// SEO metadata
export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore highlights from our events and conferences.',
};

// Helper to compute RGBA overlay from opacity
function overlayStyle(opacityPercent: number | undefined) {
  const clamped = Math.max(0, Math.min(100, typeof opacityPercent === 'number' ? opacityPercent : 50));
  const alpha = clamped / 100;
  return { backgroundColor: `rgba(0,0,0,${alpha})` } as React.CSSProperties;
}

// Data fetch
async function getGalleryPageData(): Promise<GalleryPageData | null> {
  const query = `*[_type == "galleryPage"] | order(_createdAt desc)[0]{
    _id,
    heroBackgroundImage,
    heroTitle,
    heroSubtitle,
    heroOverlayOpacity,
    galleryImages[]{
      _key,
      image,
      alt,
      caption,
      tags
    }
  }`;

  try {
    const data = await client.fetch<GalleryPageData>(query, {}, { next: { revalidate: 300, tags: ['gallery-page'] } });
    return data || null;
  } catch (err) {
    console.error('Failed to fetch gallery page data:', err);
    return null;
  }
}

// Use the existing getImageUrl helper from getSiteSettings

function HeroSection({ data }: { data: GalleryPageData }) {
  const bgUrl = getImageUrl(data.heroBackgroundImage, { width: 1920, quality: 85, format: 'webp' });
  const styleOverlay = overlayStyle(data.heroOverlayOpacity);
  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] w-full flex items-center justify-center overflow-hidden">
      {bgUrl && (
        <Image
          src={bgUrl}
          alt={data.heroTitle || 'Gallery Hero'}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      {/* Black overlay */}
      <div className="absolute inset-0" style={styleOverlay} />

      {/* Centered text */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-white text-2xl md:text-4xl font-bold tracking-tight">{data.heroTitle}</h1>
        {data.heroSubtitle && (
          <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed">{data.heroSubtitle}</p>
        )}
      </div>
    </section>
  );
}

function GalleryGrid({ items }: { items: GalleryImageItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        No images found.
      </div>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item) => {
            const url = getImageUrl(item.image, { width: 800, quality: 80, format: 'webp' });
            if (!url) return null;
            return (
              <figure key={item._key} className="relative group overflow-hidden rounded-lg bg-white shadow-sm">
                <Image
                  src={url}
                  alt={item.alt || 'Gallery image'}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {(item.caption || (item.tags && item.tags.length > 0)) && (
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs md:text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <span className="truncate">{item.caption}</span>
                      {item.tags && item.tags.length > 0 && (
                        <span className="text-[10px] md:text-xs opacity-80">{item.tags.join(', ')}</span>
                      )}
                    </div>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default async function GalleryPage() {
  const data = await getGalleryPageData();

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-2xl">Gallery</p>
          <p className="mt-2">No content available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSection data={data} />
      <GalleryGrid items={data.galleryImages || []} />
    </div>
  );
}

