import HeaderServer from './HeaderServer';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This wrapper ensures the header is always fresh on page refresh
export default async function HeaderWrapper() {
  // Simple wrapper without time-based content to prevent hydration mismatches
  return <HeaderServer />;
}
