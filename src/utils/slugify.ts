export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function makeAlbumLink(artistSlug: string, albumSlug: string, search: string, filterBy: string) {
  return `/albums/${artistSlug}/${albumSlug}?search=${encodeURIComponent(search)}&filter=${filterBy}`;
}
