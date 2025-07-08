"use client";

interface MenuSectionAnchorNavProps {
  categories: { MENU_CATEGORY_ID: number; TITLE: string }[];
}

export default function MenuSectionAnchorNav({ categories }: MenuSectionAnchorNavProps) {
  if (!categories?.length) return null;
  return (
    <nav className="mb-6 overflow-x-auto w-full">
      <ul className="flex gap-4 px-2 sm:px-0 whitespace-nowrap">
        {categories.map((cat) => (
          <li key={cat.MENU_CATEGORY_ID}>
            <a
              href={`#category-${cat.MENU_CATEGORY_ID}`}
              className="text-primary font-medium px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              {cat.TITLE}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 