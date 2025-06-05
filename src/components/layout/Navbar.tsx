"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DropdownMenu from "../core/DropDownMenu";
import MobileMenu from "../ui/MobileMenu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ProfileDropdown from "./ProfileDropdown";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
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
      ${isScrolled ? "shadow-md" : ""}`}
      aria-label="Main Navigation"
    >
      <div className="px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/Logo/LogoFoodeezMain.svg"
            alt="Foodeez Logo"
            height={144}
            width={144}
            className="md:w-36 md:h-36 p-4 md:p-0"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <DropdownMenu
            label="Be Foodeez Partner"
            items={[
              { label: "Register Your Business", href: "/business/register" },
              // { label: "Pricing Plans", href: "/pricing" },
              { label: "Pricing Plans", href: "/coming-soon" },
              { label: "Contact Sales", href: "/contact" },
            ]}
          />

          {[{ label: "Share your Experience", href: "/share-experience" }].map(
            (link) => (
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
            )
          )}

          {status === "authenticated" ? (
            <>
              {status === "authenticated" && (
                <ProfileDropdown session={session} />
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full shadow-sm hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="lg:hidden flex items-center space-x-2">
          {status === "authenticated" && (
            <Link
              href="/dashboard"
              className="p-2 text-text-muted hover:text-primary transition"
            >
              <User className="w-6 h-6" />
            </Link>
          )}
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
        {isMenuOpen && (
          <MobileMenu
            isMenuOpen={isMenuOpen}
            // isAuthenticated={status === 'authenticated'}
            // userName={session?.user?.name}
            // onSignOut={() => signOut({ callbackUrl: "/" })}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
