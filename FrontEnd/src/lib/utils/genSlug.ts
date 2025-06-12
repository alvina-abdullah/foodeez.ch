// lib/utils.ts

import slugify from 'slugify';

/**
 * Generate a SEO-friendly slug from a name and ID
 * 
 * @param name - The name to slugify
 * @param id - The ID to append to the slug
 * @param options - Additional options for slug generation
 * @returns A URL-friendly slug combining the name and ID
 */
export function generateSlug(
  name: string | null | undefined, 
  id: number, 
  options: { 
    fallback?: string; 
    lowercase?: boolean; 
    strict?: boolean;
  } = {}
) {
  const {
    fallback = 'business',
    lowercase = true,
    strict = true,
  } = options;
  
  // Use the provided name, fallback to 'business' if empty
  const baseName = (name || fallback).trim();
  
  // Create slug with proper options
  const slugOptions = {
    lower: lowercase,     // Convert to lowercase
    strict: strict,       // Remove special characters
    trim: true,           // Trim whitespace
    replacement: '-',     // Replace spaces with hyphens
    remove: /[*+~.()'"!:@]/g,  // Custom regex for characters to remove
  };
  
  // Generate the slug
  const nameSlug = slugify(baseName, slugOptions);
  
  // Combine with ID and ensure no double hyphens
  return `${nameSlug}-${id}`.replace(/-+/g, '-');
}

/**
 * Extract the business ID from a slug
 * 
 * @param slug - The slug to extract the ID from
 * @returns The extracted ID as a number, or 0 if invalid
 */
export function extractBusinessId(slug: string | string[] | undefined): number {
  if (!slug) return 0;
  
  // Handle potential array from Next.js dynamic routes
  const slugStr = Array.isArray(slug) ? slug[0] : String(slug);
  
  // Extract the ID from the end of the slug
  const match = slugStr.match(/-(\d+)$/);
  if (!match || !match[1]) return 0;
  
  // Convert to number, defaulting to 0 if invalid
  const id = parseInt(match[1], 10);
  return isNaN(id) ? 0 : id;
}

/**
 * Parse a slug string into both name and ID components
 * 
 * @param slug - The slug to parse
 * @returns An object with the parsed name and ID
 */
export function parseSlug(slug: string | string[] | undefined) {
  if (!slug) return { name: '', id: 0 };
  
  const slugStr = Array.isArray(slug) ? slug[0] : String(slug);
  const id = extractBusinessId(slugStr);
  
  // Remove the ID part to get the name portion
  const name = id > 0 
    ? slugStr.replace(new RegExp(`-${id}$`), '').replace(/-+$/, '')
    : slugStr;
  
  return { name, id };
}

