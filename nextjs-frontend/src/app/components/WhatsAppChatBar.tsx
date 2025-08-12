'use client';

import { useEffect, useState } from 'react';
import { client } from '../sanity/client';

function sanitizeNumber(number: string) {
  return number.replace(/[\s\-\(\)]/g, '');
}

export default function WhatsAppChatBar() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [message, setMessage] = useState('Hello! I\'m interested in your conference services.');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchNumber() {
      try {
        const data = await client.fetch(
          `*[_type == "siteSettings"][0]{ "whatsappNumber": contactInfo.whatsapp }`
        );
        if (mounted) setWhatsappNumber(data?.whatsappNumber || null);
      } catch (e) {
        console.error('Failed to load WhatsApp number from Sanity', e);
      }
    }
    fetchNumber();
    const t = setTimeout(() => setVisible(true), 800);
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  if (!whatsappNumber) return null;

  const url = `https://wa.me/${sanitizeNumber(whatsappNumber)}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 grid place-items-center transition-transform duration-500 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="mx-4 mb-3 w-[min(980px,100%)] bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-gray-200 p-2">
        <div className="flex items-center gap-3">
          {/* WhatsApp Badge */}
          <div className="flex items-center gap-2 bg-green-500 text-white rounded-xl px-3 py-2 shadow">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            <span className="font-semibold">WhatsApp</span>
          </div>

          {/* Input */}
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-w-0 bg-white rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Type your message..."
          />

          {/* Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow transition-colors"
          >
            <span>Chat Now</span>
          </a>
        </div>
      </div>
    </div>
  );
}

