import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface BusinessImageProps {
  imageUrl?: string;
  businessName: string;
  className?: string;
}

const BusinessImage: React.FC<BusinessImageProps> = ({
  imageUrl,
  businessName,
  className = "",
}) => {

  return (
    <div
      className={clsx(
        "relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={businessName || "Business"}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-lg font-medium">
          No image available
        </div>
      )}

      {/* Optional gradient overlay */}
      {imageUrl && (
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent px-4 py-2 text-white text-sm flex items-end">
          {businessName}
        </div>
      )}
    </div>
  );
};

export default BusinessImage;
