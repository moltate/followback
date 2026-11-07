const USERNAME_RE = /^[a-z0-9._]{1,30}$/;

/** lowercase, trim, drop leading @. Returns null when it is not a valid Instagram username. */
export function normalizeUsername(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().replace(/^@+/, '').toLowerCase();
  return USERNAME_RE.test(cleaned) ? cleaned : null;
}

export function profileUrlFor(username: string): string {
  return `https://www.instagram.com/${username}/`;
}

/** Pull a username out of an instagram profile href. */
export function usernameFromHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  const m = href.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i);
  return m ? normalizeUsername(m[1]) : null;
}
