'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  label: string;
  href: string;
}

interface AccordionMenuProps {
  label: string;
  items: AccordionItem[];
}

export default function AccordionMenu({ label, items }: AccordionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left px-3 py-2 text-base font-medium ${isOpen ? 'text-primary' : 'text-black'} transition`}
      >
        {label}
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-black'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 pb-2">
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block px-5 py-2 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
