export function getFirstLetter(name?: string): string {
  if (!name || !name.trim()) return 'U';
  return name.trim().charAt(0).toUpperCase();
}

export function getInitials(name?: string): string {
  // Respect user directive: display the first letter of the name in profile
  return getFirstLetter(name);
}

export function getGoogleEmailAvatar(email: string): string {
  if (!email || !email.trim()) return '';
  const cleanEmail = email.trim().toLowerCase();
  return `https://unavatar.io/${encodeURIComponent(cleanEmail)}`;
}

