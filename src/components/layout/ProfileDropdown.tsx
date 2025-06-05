'use client';

import { useState, useRef } from 'react';
import { CircleUser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from "next-auth";

interface ProfileDropdownProps {
  session: Session;
}

export default function ProfileDropdown({ session }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

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
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
      },
    }),
  };

  const items = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Update Profile', href: '/dashboard/profile' },
    {
      label: 'Sign Out',
      href: '/signin',
      onClick: () => signOut({ callbackUrl: '/' }),
    },
  ];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:text-primary transition-colors">
        <CircleUser className="w-8 h-8" />
        <span className="text-sm text-muted-foreground">
          {session?.user?.name || 'Profile'}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            {items.map((item, idx) =>
              item.onClick ? (
                <motion.button
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {item.label}
                </motion.button>
              ) : (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
