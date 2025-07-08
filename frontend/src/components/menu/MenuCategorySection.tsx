"use client";
import MenuProductCardGrid from "./MenuProductCardGrid";

export default function MenuCategorySection({ category, products }: { category: string; products: any[] }) {
  return (
    <section className="mb-12">
      <h2 className="sub-heading text-center my-10">{category}</h2>
      <MenuProductCardGrid products={products} />
    </section>
  );
} 