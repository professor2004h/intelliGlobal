import { optimizedFetch } from './lib/optimizedFetching';

export interface TestimonialItem {
  imageUrl: string | null;
  customerName: string;
  review: string;
  rating: number; // 1-5
  position?: string;
  company?: string;
}

export interface TestimonialsSectionData {
  testimonials: TestimonialItem[];
}

export async function getTestimonialsSection(): Promise<TestimonialsSectionData | null> {
  try {
    const query = `*[_type == "testimonialsSection" && isActive == true] | order(_createdAt desc)[0]{
      sectionTitle,
      sectionSubtitle,
      isActive,
      testimonials[]{
        customerName,
        review,
        rating,
        position,
        company,
        "imageUrl": customerImage.asset->url
      }
    }`;

    const data = await optimizedFetch<any>(query, {}, {
      ttl: 5 * 60 * 1000,
      tags: ['testimonials-section'],
      useCache: true
    });

    if (!data || !data.isActive || !Array.isArray(data.testimonials)) return { testimonials: [] };

    // Sanitize ratings into 1..5 and trim text
    const normalized = data.testimonials.map((t: any) => ({
      imageUrl: t.imageUrl || null,
      customerName: (t.customerName || '').slice(0, 100),
      review: (t.review || '').slice(0, 500),
      rating: Math.min(5, Math.max(1, Number(t.rating) || 0)),
      position: t.position || undefined,
      company: t.company || undefined,
    }));

    return { testimonials: normalized };
  } catch (error) {
    console.error('Error fetching testimonials section:', error);
    return null;
  }
}

