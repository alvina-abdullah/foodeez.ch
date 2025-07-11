import React from "react";

export default function MenuSwitchSkeleton() {
  return (
    <div className="flex items-center justify-center h-[50vh] w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-[6px] border-t-transparent border-white/50 border-r-white/40 border-b-white/30 border-l-white/20" />
    </div>
  );
}
