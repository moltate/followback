import type { Account, ParseResult } from '../../types';
import { normalizeUsername, profileUrlFor, usernameFromHref } from '../../utils/username';

type Json = unknown;

interface StringListEntry {
  href?: string;
  value?: string;
  timestamp?: number;
}
interface Entry {
  title?: string;
  string_list_data?: StringListEntry[];
}

function isObject(v: Json): v is Record<string, Json> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Find the array of entries.
 * - followers file: top-level array
 * - following file: { relationships_following: [...] }
 * Any other shape (hashtags, requests, unfollowed lists...) is rejected on purpose,
 * so the wrong file can never be read as a follower list.
 */
function extractEntries(data: Json): Json[] | null {
  if (Array.isArray(data)) return data;
  if (isObject(data)) {
    if (Array.isArray(data.relationships_following)) return data.relationships_following;
    if (Array.isArray(data.relationships_followers)) return data.relationships_followers;
  }
  return null;
}

function accountFromEntry(entry: Json): Account | null {
  if (!isObject(entry)) return null;
  const e = entry as Entry;
  const first = Array.isArray(e.string_list_data) ? e.string_list_data[0] : undefined;

  // order: value -> title -> href
  const username =
    normalizeUsername(first?.value) ??
    normalizeUsername(e.title) ??
    usernameFromHref(first?.href);
  if (!username) return null;

  const account: Account = {
    username,
    profileUrl: typeof first?.href === 'string' && first.href.startsWith('http') ? first.href : profileUrlFor(username),
  };
  if (typeof first?.timestamp === 'number') account.followedAt = first.timestamp;
  return account;
}

/** Parse the text of ONE instagram export json file. Never throws. */
export function parseExport(text: string): ParseResult {
  const warnings: string[] = [];
  let data: Json;
  try {
    data = JSON.parse(text);
  } catch {
    return { accounts: [], warnings: ['File is not valid JSON'], skipped: 0 };
  }

  const entries = extractEntries(data);
  if (!entries) {
    return { accounts: [], warnings: ['No follower/following list found in this file'], skipped: 0 };
  }

  const seen = new Set<string>();
  const accounts: Account[] = [];
  let skipped = 0;
  for (const entry of entries) {
    const acc = accountFromEntry(entry);
    if (!acc) {
      skipped++;
      continue;
    }
    if (seen.has(acc.username)) continue;
    seen.add(acc.username);
    accounts.push(acc);
  }
  if (skipped > 0) warnings.push(`${skipped} entries could not be read and were skipped`);
  return { accounts, warnings, skipped };
}

/** Merge several files (followers_1.json, followers_2.json ...) and remove duplicates. */
export function parseMany(texts: string[]): ParseResult {
  const seen = new Set<string>();
  const accounts: Account[] = [];
  const warnings: string[] = [];
  let skipped = 0;
  texts.forEach((t, i) => {
    const r = parseExport(t);
    skipped += r.skipped;
    r.warnings.forEach((w) => warnings.push(texts.length > 1 ? `File ${i + 1}: ${w}` : w));
    for (const a of r.accounts) {
      if (seen.has(a.username)) continue;
      seen.add(a.username);
      accounts.push(a);
    }
  });
  return { accounts, warnings, skipped };
}
