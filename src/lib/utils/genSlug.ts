// lib/utils.ts

import slugify from 'slugify';

export function generateSlug(name: string, id: number) {
  return `${slugify(name || '', { lower: true, strict: true })}-${id}`;
}

export function extractBusinessId(slug: string) {
  return parseInt(slug.split('-').pop() || '0');
}