"use client";

import { useState, useRef } from "react";
import { CircleUser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import ImageUploadModal from "../ui/ImageUploadModal";

interface ProfileDropdownProps {
  session: Session;
}

export default function ProfileDropdown({ session }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/user/upload-profile-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    // Refresh the page to show the new image
    window.location.reload();
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
        type: "spring",
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
        type: "spring",
        stiffness: 300,
      },
    }),
  };

  const items = [
    { label: "User Dashboard", href: "/dashboard" },
    { label: "Update Profile", href: "/dashboard/profile" },
    {
      label: "Sign Out",
      href: "/signin",
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  // Function to check if the image URL is valid
 const isValidImageUrl = (url: string | null | undefined) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:text-primary transition-colors">
          {session?.user?.image && isValidImageUrl(session.user.image) ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden group">
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                fill
                className="object-cover"
                unoptimized={session.user.image.startsWith('http')}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUploadModalOpen(true);
                }}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <CircleUser className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <CircleUser className="w-8 h-8 text-gray-400" />
            </button>
          )}
          <span className="text-sm text-muted-foreground">
            {session?.user?.name || "Profile"}
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
              <div className="p-3 border-b">
                <div className="flex items-center gap-3">
                  {session?.user?.image && isValidImageUrl(session.user.image) ? (
                    <div className="flex-shrink-0 relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        fill
                        className="object-cover"
                        unoptimized={session.user.image.startsWith('http')}
                      />
                    </div>
                  ) : (
                    <CircleUser className="w-10 h-10" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </p>
                  </div>
                </div>
              </div>
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

      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleImageUpload}
        currentImage={session?.user?.image || null}
      />
    </>
  );
}
