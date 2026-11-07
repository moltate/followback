import * as React from 'react';
import { pickExportFiles } from '../services/file-picker';
import { buildFromFiles } from '../services/import-builder';
import { useStore } from '../store';

export interface ImportState {
  loading: boolean;
  error: string | null;
  warnings: string[];
  /** counts of the last successful import */
  last: { followers: number; following: number } | null;
}

/** Pick files -> parse -> save as a new snapshot. All errors become readable messages. */
export function useImport() {
  const addSnapshot = useStore((s) => s.addSnapshot);
  const [state, setState] = React.useState<ImportState>({ loading: false, error: null, warnings: [], last: null });

  const run = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null, warnings: [] }));
    try {
      const picked = await pickExportFiles();
      if (!picked) {
        setState((s) => ({ ...s, loading: false }));
        return false;
      }
      const result = buildFromFiles(picked.files);
      const warnings = [...picked.rejected.map((n) => `"${n}" is not a .json file, so it was ignored`), ...result.warnings];
      if (!result.ok) {
        setState({ loading: false, error: result.error ?? 'Import failed', warnings, last: null });
        return false;
      }
      addSnapshot(result.followers, result.following);
      setState({ loading: false, error: null, warnings, last: { followers: result.followers.length, following: result.following.length } });
      return true;
    } catch (e) {
      setState({ loading: false, error: `Could not read the files (${e instanceof Error ? e.message : 'unknown error'})`, warnings: [], last: null });
      return false;
    }
  }, [addSnapshot]);

  return { ...state, run };
}
