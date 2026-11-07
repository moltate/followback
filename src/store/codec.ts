import type { Account, Snapshot } from '../types';
import { profileUrlFor } from '../utils/username';

/**
 * Compact on-disk format. We do not store profileUrl (it is derived from the username),
 * which cuts the saved size to roughly a third for big accounts.
 */
interface CompactAccount {
  u: string;
  t?: number;
}
interface CompactSnapshot {
  id: string;
  at: number;
  f: CompactAccount[];
  g: CompactAccount[];
}

const enc = (a: Account): CompactAccount => (a.followedAt === undefined ? { u: a.username } : { u: a.username, t: a.followedAt });
const dec = (c: CompactAccount): Account => ({
  username: c.u,
  profileUrl: profileUrlFor(c.u),
  ...(c.t !== undefined ? { followedAt: c.t } : {}),
});

export function encodeSnapshots(list: Snapshot[]): CompactSnapshot[] {
  return list.map((s) => ({ id: s.id, at: s.importedAt, f: s.followers.map(enc), g: s.following.map(enc) }));
}

/** Tolerant: any broken record is dropped instead of crashing the app on launch. */
export function decodeSnapshots(raw: unknown): Snapshot[] {
  if (!Array.isArray(raw)) return [];
  const out: Snapshot[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const s = r as Partial<CompactSnapshot>;
    if (typeof s.id !== 'string' || typeof s.at !== 'number' || !Array.isArray(s.f) || !Array.isArray(s.g)) continue;
    const valid = (c: unknown): c is CompactAccount => !!c && typeof (c as CompactAccount).u === 'string';
    out.push({ id: s.id, importedAt: s.at, followers: s.f.filter(valid).map(dec), following: s.g.filter(valid).map(dec) });
  }
  return out;
}
