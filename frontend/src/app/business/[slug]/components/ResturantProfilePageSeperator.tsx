import { Separator } from "@/components/ui/separator";
import React from "react";

const ResturantProfilePageSeperator = ({text}: {text: string}) => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full bg-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-primary text-white px-8 py-2 rounded-full text-sm md:text-base lg:text-lg font-medium">
          {text}
        </span>
      </div>
    </div>
  );
};

export default ResturantProfilePageSeperator;
