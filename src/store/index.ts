import * as React from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Account, Snapshot } from '../types';
import { decodeSnapshots, encodeSnapshots } from './codec';

const MAX_SNAPSHOTS = 6;

interface State {
  snapshots: Snapshot[]; // oldest first, newest last
  /** usernames the user already unfollowed on Instagram (checklist) */
  done: Record<string, true>;
  addSnapshot: (followers: Account[], following: Account[]) => void;
  deleteSnapshot: (id: string) => void;
  toggleDone: (username: string) => void;
  clearAll: () => void;
}

/** Wrap AsyncStorage so snapshots are saved in the compact format. */
const storage: StateStorage = {
  getItem: async (name) => {
    try {
      // a storage failure must never leave the app waiting forever: act as "no saved data"
      const raw = await AsyncStorage.getItem(name);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const state = parsed?.state ?? {};
      return JSON.stringify({
        ...parsed,
        state: { snapshots: decodeSnapshots(state.snapshots), done: state.done ?? {} },
      });
    } catch {
      return null; // corrupted data -> start clean instead of crashing
    }
  },
  setItem: async (name, value) => {
    try {
      const parsed = JSON.parse(value);
      const state = parsed.state ?? {};
      await AsyncStorage.setItem(name, JSON.stringify({ ...parsed, state: { ...state, snapshots: encodeSnapshots(state.snapshots ?? []) } }));
    } catch (e) {
      console.warn('FollowBack: could not save data', e);
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      console.warn('FollowBack: could not remove data', e);
    }
  },
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      snapshots: [],
      done: {},
      addSnapshot: (followers, following) =>
        set((s) => ({
          snapshots: [...s.snapshots, { id: String(Date.now()), importedAt: Date.now(), followers, following }].slice(-MAX_SNAPSHOTS),
          // the export is the truth: anyone still in "following" was not really unfollowed
          done: {},
        })),
      deleteSnapshot: (id) => set((s) => ({ snapshots: s.snapshots.filter((x) => x.id !== id) })),
      toggleDone: (username) =>
        set((s) => {
          const done = { ...s.done };
          if (done[username]) delete done[username];
          else done[username] = true;
          return { done };
        }),
      clearAll: () => set({ snapshots: [], done: {} }),
    }),
    {
      name: 'followback-v1',
      version: 1,
      storage: createJSONStorage(() => storage),
      partialize: (s) => ({ snapshots: s.snapshots, done: s.done }),
    },
  ),
);

/** true once saved data has been read from the phone */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(useStore.persist.hasHydrated());
  React.useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
