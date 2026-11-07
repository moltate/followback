export interface Account {
  /** normalized: lowercase, no @ */
  username: string;
  /** profile link from the export, or a generated instagram.com link */
  profileUrl: string;
  /** unix seconds from the export, if present */
  followedAt?: number;
}

export interface ParseResult {
  accounts: Account[];
  warnings: string[];
  skipped: number;
}

export interface Relationships {
  followers: Account[];
  following: Account[];
  /** I follow them, they don't follow me */
  notFollowingBack: Account[];
  /** They follow me, I don't follow them */
  fans: Account[];
  /** Both follow each other */
  mutuals: Account[];
  /** mutuals / following, 0-100 */
  followBackRate: number;
}

export interface Snapshot {
  id: string;
  /** epoch ms */
  importedAt: number;
  followers: Account[];
  following: Account[];
}

export interface SnapshotDiff {
  newFollowers: Account[];
  lostFollowers: Account[];
  newFollowing: Account[];
  stoppedFollowing: Account[];
}
