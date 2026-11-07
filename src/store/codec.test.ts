import { decodeSnapshots, encodeSnapshots } from './codec';
import type { Snapshot } from '../types';

const snap: Snapshot = {
  id: 's1',
  importedAt: 123,
  followers: [{ username: 'a', profileUrl: 'https://www.instagram.com/a/', followedAt: 9 }],
  following: [{ username: 'b', profileUrl: 'https://www.instagram.com/b/' }],
};

describe('snapshot codec', () => {
  it('round-trips', () => {
    const back = decodeSnapshots(JSON.parse(JSON.stringify(encodeSnapshots([snap]))));
    expect(back).toEqual([snap]);
  });
  it('is smaller than the plain format', () => {
    expect(JSON.stringify(encodeSnapshots([snap])).length).toBeLessThan(JSON.stringify([snap]).length);
  });
  it('drops broken records instead of throwing', () => {
    expect(decodeSnapshots([null, 5, { id: 1 }, { id: 'x', at: 1, f: [{ nope: 1 }], g: [] }])).toEqual([
      { id: 'x', importedAt: 1, followers: [], following: [] },
    ]);
    expect(decodeSnapshots('garbage')).toEqual([]);
  });
});
