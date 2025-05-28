"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DropdownMenu from "../core/DropDownMenu";
import MobileMenu from "../ui/MobileMenu";
import Image from "next/image";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`z-50 h-auto sticky top-0 transition-all duration-300 bg-background 
     ${isScrolled ? "" : ""}
        `}
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-between py-4">
        {/* Logo */}

        <Link href="/">
          <Image
            src="/Logo/LogoFoodeezMain.svg"
            alt="Foodeez Logo"
            height={120}
            width={120}
            className=""
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-5">
          {[
            // { label: "Share your Experiance", href: "/review" }
            { label: "Share your Experiance", href: "/coming-soon" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 transition-colors rounded-md ${
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-text-main hover:text-primary hover:bg-primary/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu
            label="Be Foodeez Partner"
            items={[
              // { label: "Register Your Business", href: "/business/register" },
              // { label: "Pricing Plans", href: "/pricing" },
              // { label: "Contact Sales", href: "/contact" },
              { label: "Register Your Business", href: "/coming-soon" },
              { label: "Pricing Plans", href: "/coming-soon" },
              { label: "Contact Sales", href: "/contact" },
            ]}
          />

          <Link
            // href="/signin"
            href="/coming-soon"
            className="text-sm font-medium text-primary hover:text-primary-dark transition"
          >
            Sign in
          </Link>
          <Link
            // href="/signup"
            href="/coming-soon"
            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Icons */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-text-muted hover:text-primary transition"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && <MobileMenu isMenuOpen />}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
