// components/SocialLinks.tsx

import { Facebook, Instagram, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface SocialLinksProps {
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
}

export function SocialLinks({ facebook, instagram, whatsapp }: SocialLinksProps) {
  return (
    <div className="flex gap-4 pt-4">
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600"
        >
          <Facebook className="w-6 h-6" />
        </a>
      )}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-600"
        >
          <Instagram className="w-6 h-6" />
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-green-600"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}