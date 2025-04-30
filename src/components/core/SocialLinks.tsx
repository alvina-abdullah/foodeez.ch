import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils"; // optional utility for class merging

interface SocialLinksProps {
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "default" | "circle" | "filled";
  className?: string;
}

const ICON_SIZE = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  "2xl": 48,
};

export function SocialLinks({
  facebook,
  instagram,
  whatsapp,
  twitter,
  linkedin,
  youtube,
  tiktok,
  size = "md",
  variant = "default",
  className = "",
}: SocialLinksProps) {
  const sizePx = ICON_SIZE[size];

  const platforms = [
    { name: "facebook", url: facebook },
    { name: "instagram", url: instagram },
    { name: "whatsapp", url: whatsapp?.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp?.replace(/\D/g, "")}` },
    { name: "twitter", url: twitter },
    { name: "linkedin", url: linkedin },
    { name: "youtube", url: youtube },
    { name: "tiktok", url: tiktok },
  ];

  const baseWrapperStyle = {
    default: "",
    circle: "rounded-full border p-1",
    filled: "rounded-full bg-white shadow p-1",
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {platforms.map(
        ({ name, url }) =>
          url && (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("group transition-all duration-200", baseWrapperStyle[variant])}
              aria-label={name}
            >
              <Image
                src={`/svgs/${name}.svg`}
                alt={`${name} icon`}
                width={sizePx}
                height={sizePx}
                className="object-contain"
              />
            </Link>
          )
      )}
    </div>
  );
}
