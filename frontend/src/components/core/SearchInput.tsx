'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const searchInputVariants = cva(
  'flex items-center relative w-full',
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      },
      variant: {
        default: 'bg-white border border-gray-300 rounded-md hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200',
        filled: 'bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus-within:bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200',
        pill: 'bg-white border border-gray-300 rounded-full hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      shadow: 'sm',
    },
  }
);

const inputSizeVariants = {
  sm: 'text-sm py-1',
  md: 'text-base py-2',
  lg: 'text-lg py-3',
};

export interface SearchInputProps extends VariantProps<typeof searchInputVariants> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  showSearchButton?: boolean;
  searchButtonText?: string;
}

export default function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  size = 'md',
  variant = 'default',
  shadow = 'sm',
  className,
  showSearchButton = false,
  searchButtonText,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value || '');
  const inputSize = size ? inputSizeVariants[size] : inputSizeVariants.md;
  
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : localValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setLocalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const handleClear = () => {
    if (!isControlled) {
      setLocalValue('');
    }
    onChange?.('');
  };  
  
  const handleSearch = () => {
    onSearch?.(inputValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(inputValue);
    }
  };
  
  return (
    <div className={searchInputVariants({ size, variant, shadow, className })}>
      <div className="pl-3 text-gray-400">
        <Search size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      </div>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${inputSize} w-full px-2 bg-transparent outline-none text-secondary-900 placeholder-gray-400`}
      />
      
      {inputValue && (
        <button 
          onClick={handleClear}
          className="px-2 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
          aria-label="Clear search"
        >
          <X size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        </button>
      )}
      
      {showSearchButton && (
        <button
          onClick={handleSearch}
          className="h-full px-4 bg-primary-600 text-white font-medium rounded-r-full hover:bg-primary-700 transition-colors"
          type="button"
        >
          {searchButtonText || (
            <Search size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
          )}
        </button>
      )}
    </div>
  );
} 