import { client } from "../sanity/client";

function sanitizeNumber(number: string) {
  // Remove spaces, dashes, parentheses
  return number.replace(/[\s\-\(\)]/g, "");
}

export default async function WhatsAppPill() {
  // Fetch WhatsApp number from Sanity Site Settings
  const data = await client.fetch(
    `*[_type == "siteSettings"][0]{ "whatsappNumber": contactInfo.whatsapp }`,
    {},
    { next: { revalidate: 1800, tags: ["site-settings"] } }
  );

  const number: string | undefined = data?.whatsappNumber;
  if (!number) return null;

  const href = `https://wa.me/${sanitizeNumber(number)}?text=${encodeURIComponent(
    "Hello! I'm interested in your conference services."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Us"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#20bf5a] transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
      </svg>
      <span className="font-semibold">WhatsApp Us</span>
    </a>
  );
}

