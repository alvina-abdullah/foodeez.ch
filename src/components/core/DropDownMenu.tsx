'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownItem[];
}

export default function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 300ms delay before closing
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300
      }
    })
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
        {label}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="ml-1 h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 mt-2 w-48 shadow-lg rounded-md overflow-hidden z-50 bg-background"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm text-secondary hover:bg-primary/10 hover:text-primary-dark transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}