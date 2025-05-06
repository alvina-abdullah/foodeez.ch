import { motion } from "framer-motion";
import Image from "next/image";

interface GooglePhoto {
  photoUrl: string;
  width: number;
  height: number;
}

interface GooglePhotoGalleryProps {
  photos: GooglePhoto[];
  businessName?: string;
}

export default function GooglePhotoGallery({
  photos,
  businessName,
}: GooglePhotoGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No photos available.</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📸 Photo Gallery {businessName && `of ${businessName}`}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.slice(0, 12).map((photo, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={photo.photoUrl}
              alt={`${businessName || "Business"} photo ${index + 1}`}
              width={photo.width}
              height={photo.height}
              className="object-cover w-full h-40 md:h-48"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
