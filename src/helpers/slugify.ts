

export const slugify = (text: string): string => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Slug çakışması durumunda benzersiz bir slug üretir.
 * checkExists: verilen slug'ın DB'de olup olmadığını kontrol eden fonksiyon
 * Örn: "kinderfest-im-park" doluysa → "kinderfest-im-park-2", "kinderfest-im-park-3" dener
 */
export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  const baseSlug = slugify(text);
  let slug = baseSlug;
  let counter = 2;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};