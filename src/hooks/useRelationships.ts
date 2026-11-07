import * as React from 'react';
import { useStore } from '../store';
import { computeRelationships } from '../services/relationship-engine';
import type { Relationships, Snapshot } from '../types';

/** Relationships of the newest import (null before the first import). */
export function useRelationships(): { rel: Relationships | null; latest: Snapshot | null } {
  const snapshots = useStore((s) => s.snapshots);
  const latest = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const rel = React.useMemo(() => (latest ? computeRelationships(latest.followers, latest.following) : null), [latest]);
  return { rel, latest };
}
