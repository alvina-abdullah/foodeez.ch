"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { extractBusinessId } from "@/lib/utils/genSlug";
import { getBusinessById } from "@/services/BusinessProfilePageService";
import {
  business_detail_view_all,
  business_food_menu_card_view,
} from "@prisma/client";
import { getMenuProducts } from "@/services/MenuPageService";
import MenuLoadingSkeleton from "@/components/menu/MenuLoadingSkeleton";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import MenuCategorySection from "@/components/menu/MenuCategorySection";

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const businessId = extractBusinessId(slug);

  const [menu, setMenu] = useState<business_food_menu_card_view[] | null>(null);
  const [business, setBusiness] = useState<business_detail_view_all | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [businessData, menuData] = await Promise.all([
        getBusinessById(businessId),
        getMenuProducts({ businessId }),
      ]);
      setBusiness(businessData);
      setMenu(menuData);
      setLoading(false);
    }
    if (businessId) fetchData();
  }, [businessId, slug]);

  if (loading) return <MenuLoadingSkeleton />;
  if (!menu || menu.length === 0)
    return (
      <div className="text-center py-12 text-lg text-text-muted">
        Menu Not Found
      </div>
    );

  // Filter menu items by selected menu
  const filteredMenu = selectedMenuId
    ? menu.filter(
        (item) => String(item.BUSINESS_FOOD_MENU_CARD_ID) === selectedMenuId
      )
    : menu;

  // Group filtered menu items by CATEGORY
  const menuByCategory = filteredMenu.reduce(
    (acc, item) => {
      const cat = item.CATEGORY || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, business_food_menu_card_view[]>
  );

  // Meta data
  const title = business?.BUSINESS_NAME
    ? `Reserve a Table at ${business.BUSINESS_NAME} | Foodeez`
    : "Reserve a Table | Foodeez";
  const description = business?.DESCRIPTION
    ? `Reserve your table at ${business.BUSINESS_NAME} on Foodeez. ${business?.DESCRIPTION}`
    : `Reserve your table at ${business?.BUSINESS_NAME} on Foodeez.`;
  const image = business?.IMAGE_URL || "/reservation-default.jpg";
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
      </head>

      <div className="px-4 lg:px-0">
        <MenuHeroSection business={business || null} />

        {Object.entries(menuByCategory).map(
          ([category, products], idx, arr) => (
            <div key={category}>
              <MenuCategorySection category={category} products={products} />
              {idx < arr.length - 1 && (
                <hr
                  className="my-12 border-t-2 border-background-muted"
                  aria-hidden="true"
                />
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
