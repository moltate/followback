import { computeRelationships, compareSnapshots } from './index';
import type { Account, Snapshot } from '../../types';

const acc = (u: string): Account => ({ username: u, profileUrl: `https://www.instagram.com/${u}/` });
const list = (...u: string[]) => u.map(acc);
const names = (l: Account[]) => l.map((a) => a.username);

describe('computeRelationships', () => {
  const followers = list('a', 'b', 'c');
  const following = list('b', 'c', 'd', 'e');
  const r = computeRelationships(followers, following);

  it('notFollowingBack = I follow, they do not', () => expect(names(r.notFollowingBack)).toEqual(['d', 'e']));
  it('fans = they follow, I do not', () => expect(names(r.fans)).toEqual(['a']));
  it('mutuals = both', () => expect(names(r.mutuals)).toEqual(['b', 'c']));
  it('followBackRate = mutuals / following', () => expect(r.followBackRate).toBe(50));

  it('handles empty lists', () => {
    const e = computeRelationships([], []);
    expect(e.followBackRate).toBe(0);
    expect(e.mutuals).toEqual([]);
  });
  it('rounds the rate to one decimal', () => {
    const x = computeRelationships(list('a'), list('a', 'b', 'c'));
    expect(x.followBackRate).toBe(33.3);
  });
  it('is fast on 200k accounts', () => {
    const big = Array.from({ length: 200000 }, (_, i) => acc(`u${i}`));
    const half = big.filter((_, i) => i % 2 === 0);
    const t = Date.now();
    const res = computeRelationships(big, half);
    expect(Date.now() - t).toBeLessThan(3000);
    expect(res.mutuals).toHaveLength(100000);
  });
});

describe('compareSnapshots', () => {
  const snap = (followers: string[], following: string[], id = 's'): Snapshot => ({
    id,
    importedAt: 0,
    followers: list(...followers),
    following: list(...following),
  });
  it('finds new and lost followers / following', () => {
    const d = compareSnapshots(snap(['a', 'b'], ['x', 'y']), snap(['b', 'c'], ['y', 'z']));
    expect(names(d.newFollowers)).toEqual(['c']);
    expect(names(d.lostFollowers)).toEqual(['a']);
    expect(names(d.newFollowing)).toEqual(['z']);
    expect(names(d.stoppedFollowing)).toEqual(['x']);
  });
  it('identical snapshots give empty diff', () => {
    const d = compareSnapshots(snap(['a'], ['b']), snap(['a'], ['b']));
    expect(d.newFollowers.length + d.lostFollowers.length + d.newFollowing.length + d.stoppedFollowing.length).toBe(0);
  });
});
