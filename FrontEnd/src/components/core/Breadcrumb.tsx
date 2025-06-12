import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm text-text-muted space-x-1 ${className}`} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {idx > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
          {item.href && idx !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-primary transition-colors underline-offset-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-main font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb; 