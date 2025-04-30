import React from "react";

type StarIconProps = {
  fillLevel: number; // from 0.1 to 1.0
  size?: number;     // optional, default is 48
};

const StarIcon: React.FC<StarIconProps> = ({ fillLevel, size = 20 }) => {
  const clipId = `clip-${Math.round(fillLevel * 10)}`;

  const clipPaths = (
    <defs>
      {Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        return (
          <clipPath key={level} id={`clip-${level}`}>
            <rect width={(level * 48) / 10} height="48" />  
          </clipPath>
        );
      })}
      <clipPath id="clip-10">
        <rect width="48" height="48" />
      </clipPath>
    </defs>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      {clipPaths}

      {/* Gray background star */}
      <path
        fill="#E0E0E0"
        d="M24 2L28.09 16.26L44 18.24L31.82 29.14L35.27 44L24 36.27L12.73 44L16.18 29.14L4 18.24L19.91 16.26L24 2z"
      />

      {/* Yellow foreground star with clip */}
      <path
        fill="#FFD700"
        clipPath={`url(#clip-${Math.round(fillLevel * 10)})`}
        d="M24 2L28.09 16.26L44 18.24L31.82 29.14L35.27 44L24 36.27L12.73 44L16.18 29.14L4 18.24L19.91 16.26L24 2z"
      />
    </svg>
  );
};

export default StarIcon;
