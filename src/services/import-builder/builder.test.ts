import { buildFromFiles, classifyExport } from './index';

const entry = (u: string) => ({ title: u, string_list_data: [{ href: `https://www.instagram.com/${u}`, timestamp: 1 }] });
const followers1 = JSON.stringify([entry('a'), entry('b')]);
const followers2 = JSON.stringify([entry('b'), entry('c')]);
const following = JSON.stringify({ relationships_following: [entry('b'), entry('d')] });
const hashtags = JSON.stringify({ relationships_following_hashtags: [entry('x')] });

describe('classifyExport', () => {
  it('detects followers, following, unknown', () => {
    expect(classifyExport(followers1)).toBe('followers');
    expect(classifyExport(following)).toBe('following');
    expect(classifyExport(hashtags)).toBe('unknown');
    expect(classifyExport('nope')).toBe('unknown');
  });
});

describe('buildFromFiles', () => {
  it('merges multiple followers files and reads following', () => {
    const r = buildFromFiles([
      { name: 'followers_1.json', text: followers1 },
      { name: 'followers_2.json', text: followers2 },
      { name: 'following.json', text: following },
    ]);
    expect(r.ok).toBe(true);
    expect(r.followers.map((a) => a.username)).toEqual(['a', 'b', 'c']);
    expect(r.following.map((a) => a.username)).toEqual(['b', 'd']);
  });
  it('fails clearly when following is missing', () => {
    const r = buildFromFiles([{ name: 'followers_1.json', text: followers1 }]);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/following/);
  });
  it('ignores unrelated files with a warning', () => {
    const r = buildFromFiles([
      { name: 'followers_1.json', text: followers1 },
      { name: 'following.json', text: following },
      { name: 'following_hashtags.json', text: hashtags },
    ]);
    expect(r.ok).toBe(true);
    expect(r.warnings.some((w) => w.includes('following_hashtags.json'))).toBe(true);
  });
  it('fails on empty selection', () => {
    expect(buildFromFiles([]).ok).toBe(false);
  });
});
