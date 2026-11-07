import type { Account, Relationships, Snapshot, SnapshotDiff } from '../../types';

function toSet(list: Account[]): Set<string> {
  const s = new Set<string>();
  for (const a of list) s.add(a.username);
  return s;
}

/** O(n + m) using Sets, no nested loops. */
export function computeRelationships(followers: Account[], following: Account[]): Relationships {
  const followerSet = toSet(followers);
  const followingSet = toSet(following);

  const notFollowingBack: Account[] = [];
  const mutuals: Account[] = [];
  for (const a of following) {
    (followerSet.has(a.username) ? mutuals : notFollowingBack).push(a);
  }
  const fans = followers.filter((a) => !followingSet.has(a.username));

  const followBackRate = following.length === 0 ? 0 : Math.round((mutuals.length / following.length) * 1000) / 10;

  return { followers, following, notFollowingBack, fans, mutuals, followBackRate };
}

function minus(a: Account[], b: Account[]): Account[] {
  const bs = toSet(b);
  return a.filter((x) => !bs.has(x.username));
}

/** Compare an older and a newer import. */
export function compareSnapshots(older: Snapshot, newer: Snapshot): SnapshotDiff {
  return {
    newFollowers: minus(newer.followers, older.followers),
    lostFollowers: minus(older.followers, newer.followers),
    newFollowing: minus(newer.following, older.following),
    stoppedFollowing: minus(older.following, newer.following),
  };
}
