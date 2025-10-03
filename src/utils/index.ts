/**
 * Generate a random username (e.g user-abc123)
 */

export const genUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomString = Math.random().toString(36).substring(2, 8);
  return usernamePrefix + randomString;
};

export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;
  return uniqueSlug;
};
