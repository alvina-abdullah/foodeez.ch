"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { extractBusinessId } from "@/lib/utils/genSlug";
import MenuHeroSection from "./MenuHeroSection";
import MenuSectionAnchorNav from "./MenuSectionAnchorNav";
import MenuFilterSortBar from "./MenuFilterSortBar";
import MenuProductCardGrid from "./MenuProductCardGrid";
import MenuPagination from "./MenuPagination";

interface MenuClientProps {
  categories: any[];
  initialProducts: any[];
  productCount: number;
  businessId: number;
}

export default function MenuClient({ categories, initialProducts, productCount , businessId }: MenuClientProps) {

  // State for products, filters, pagination, etc.
  const [products, setProducts] = useState(initialProducts);
  // TODO: Add state for filters, sort, page, etc.

  return (
    <div className="bg-background min-h-screen py-8 px-2 sm:px-6 lg:px-8">
      <MenuHeroSection productCount={productCount} />
      {/* <MenuSectionAnchorNav
        categories={categories.map(cat => ({
          MENU_CATEGORY_ID: cat.MENU_CATEGORY_ID,
          TITLE: cat.TITLE ?? "",
        }))}
      /> */}
      {/* <MenuFilterSortBar
        categories={categories.map(cat => ({
          MENU_CATEGORY_ID: cat.MENU_CATEGORY_ID,
          TITLE: cat.TITLE ?? "",
        }))}
      /> */}
      <MenuProductCardGrid products={products} />
      <MenuPagination total={productCount} />
    </div>
  );
} 