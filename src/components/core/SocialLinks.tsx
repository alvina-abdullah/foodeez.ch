// components/SocialLinks.tsx

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

interface SocialLinksProps {
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  website?: string | null;
  size?: "sm" | "md" | "lg";
  color?: "default" | "white" | "primary" | "colored";
  variant?: "default" | "circle" | "filled";
  className?: string;
}

export function SocialLinks({
  facebook,
  instagram,
  whatsapp,
  twitter,
  linkedin,
  youtube,
  tiktok,
  website,
  size = "md",
  color = "default",
  variant = "default",
  className = "",
}: SocialLinksProps) {
  // Size mapping
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  // Parent container size
  const containerSizeMap = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-5",
  };

  // Icon wrapper size
  const wrapperSizeMap = {
    sm: variant === "circle" || variant === "filled" ? "w-6 h-6" : "",
    md: variant === "circle" || variant === "filled" ? "w-9 h-9" : "",
    lg: variant === "circle" || variant === "filled" ? "w-12 h-12" : "",
  };

  // Color mapping for default variant
  const colorMap = {
    default: "text-gray-600 hover:text-gray-900",
    white: "text-white hover:text-white/80",
    primary: "text-primary hover:text-primary-dark",
    colored:
      "group-[.facebook]:text-blue-600 group-[.instagram]:text-pink-600 group-[.twitter]:text-blue-400 group-[.linkedin]:text-blue-700 group-[.youtube]:text-red-600 group-[.tiktok]:text-black",
  };

  // Background colors for filled variant
  const bgColorMap = {
    default: "bg-gray-100 hover:bg-gray-200",
    white: "bg-white/10 hover:bg-white/20",
    primary: "bg-primary hover:bg-primary-dark text-white",
    colored:
      "group-[.facebook]:bg-blue-600 group-[.instagram]:bg-pink-600 group-[.twitter]:bg-blue-400 group-[.linkedin]:bg-blue-700 group-[.youtube]:bg-red-600 group-[.tiktok]:bg-black text-white hover:opacity-90",
  };

  // Border colors for circle variant
  const borderColorMap = {
    default: "border-gray-300 hover:border-gray-500",
    white: "border-white/50 hover:border-white",
    primary: "border-primary-500 hover:border-primary",
    colored:
      "group-[.facebook]:border-blue-600 group-[.instagram]:border-pink-600 group-[.twitter]:border-blue-400 group-[.linkedin]:border-blue-700 group-[.youtube]:border-red-600 group-[.tiktok]:border-black",
  };

  // Apply styling based on variant
  const getBaseClasses = (platform: string) => {
    const baseClasses = [
      "transition-all duration-200 flex items-center justify-center group " +
        platform,
    ];

    if (variant === "default") {
      baseClasses.push(colorMap[color]);
    } else if (variant === "circle") {
      baseClasses.push(colorMap[color]);
      baseClasses.push(wrapperSizeMap[size]);
      baseClasses.push("rounded-full border");
      baseClasses.push(borderColorMap[color]);
    } else if (variant === "filled") {
      baseClasses.push(bgColorMap[color]);
      baseClasses.push(wrapperSizeMap[size]);
      baseClasses.push("rounded-full");
    }

    return baseClasses.join(" ");
  };

  return (
    <div className={`flex ${containerSizeMap[size]} ${className}`}>
      {facebook && (
        <Link
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("facebook")}
          aria-label="Facebook"
        >
          <Facebook className={sizeMap[size]} />
        </Link>
      )}

      {instagram && (
        <Link
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("instagram")}
          aria-label="Instagram"
        >
          <Instagram className={sizeMap[size]} />
        </Link>
      )}

      {whatsapp && (
        <Link
          href={
            whatsapp.startsWith("http")
              ? whatsapp
              : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("whatsapp")}
          aria-label="WhatsApp"
        >
          <FaWhatsapp className={sizeMap[size]} />
        </Link>
      )}

      {twitter && (
        <Link
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("twitter")}
          aria-label="Twitter"
        >
          <Twitter className={sizeMap[size]} />
        </Link>
      )}

      {linkedin && (
        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("linkedin")}
          aria-label="LinkedIn"
        >
          <Linkedin className={sizeMap[size]} />
        </Link>
      )}

      {youtube && (
        <Link
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("youtube")}
          aria-label="YouTube"
        >
          <Youtube className={sizeMap[size]} />
        </Link>
      )}

      {tiktok && (
        <Link
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("tiktok")}
          aria-label="TikTok"
        >
          <FaTiktok className={sizeMap[size]} />
        </Link>
      )}

      {website && (
        <Link
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className={getBaseClasses("website")}
          aria-label="Website"
        >
          <Globe className={sizeMap[size]} />
        </Link>
      )}
    </div>
  );
}
