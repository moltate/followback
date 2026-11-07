import type { Account } from '../../types';
import { parseMany } from '../instagram-parser';

export interface PickedFile {
  name: string;
  text: string;
}

export type FileKind = 'followers' | 'following' | 'unknown';

/**
 * Decide what a file is by its CONTENT (file names can be renamed by the user):
 * - { relationships_following: [...] }  -> following
 * - top-level array                     -> followers (followers_1.json ...)
 * - anything else                       -> unknown (ignored)
 */
export function classifyExport(text: string): FileKind {
  try {
    const data: unknown = JSON.parse(text);
    if (Array.isArray(data)) return 'followers';
    if (typeof data === 'object' && data !== null) {
      const o = data as Record<string, unknown>;
      if (Array.isArray(o.relationships_following)) return 'following';
      if (Array.isArray(o.relationships_followers)) return 'followers';
    }
  } catch {
    /* fall through */
  }
  return 'unknown';
}

export interface BuildResult {
  ok: boolean;
  followers: Account[];
  following: Account[];
  warnings: string[];
  /** human readable reason when ok is false */
  error?: string;
}

/** Turn the picked files into followers + following lists. Never throws. */
export function buildFromFiles(files: PickedFile[]): BuildResult {
  const followersTexts: string[] = [];
  const followingTexts: string[] = [];
  const warnings: string[] = [];

  for (const f of files) {
    const kind = classifyExport(f.text);
    if (kind === 'followers') followersTexts.push(f.text);
    else if (kind === 'following') followingTexts.push(f.text);
    else warnings.push(`"${f.name}" is not a followers or following file, so it was ignored`);
  }

  if (followersTexts.length === 0 || followingTexts.length === 0) {
    const missing = [followersTexts.length === 0 ? 'followers' : null, followingTexts.length === 0 ? 'following' : null]
      .filter(Boolean)
      .join(' and ');
    return {
      ok: false,
      followers: [],
      following: [],
      warnings,
      error: `Missing ${missing} file. Pick followers_1.json and following.json together.`,
    };
  }

  const followers = parseMany(followersTexts);
  const following = parseMany(followingTexts);
  warnings.push(...followers.warnings, ...following.warnings);

  if (followers.accounts.length === 0 && following.accounts.length === 0) {
    return { ok: false, followers: [], following: [], warnings, error: 'No accounts could be read from these files.' };
  }
  return { ok: true, followers: followers.accounts, following: following.accounts, warnings };
}
