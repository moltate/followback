import { parseExport, parseMany } from './index';
import { normalizeUsername } from '../../utils/username';

const followersFile = JSON.stringify([
  { title: '', media_list_data: [], string_list_data: [{ href: 'https://www.instagram.com/Alice_01', value: 'Alice_01', timestamp: 1700000000 }] },
  { title: 'bob.k', string_list_data: [{ href: 'https://www.instagram.com/bob.k', timestamp: 1700000100 }] },
  { string_list_data: [{ href: 'https://www.instagram.com/_u/carol', timestamp: 1700000200 }] },
]);

const followingFile = JSON.stringify({
  relationships_following: [
    { title: 'dave', string_list_data: [{ href: 'https://www.instagram.com/dave', timestamp: 1 }] },
    { title: 'alice_01', string_list_data: [{ href: 'https://www.instagram.com/alice_01', timestamp: 2 }] },
  ],
});

describe('normalizeUsername', () => {
  it('lowercases, trims and strips @', () => {
    expect(normalizeUsername('  @Hello.World ')).toBe('hello.world');
  });
  it('rejects invalid', () => {
    expect(normalizeUsername('has space')).toBeNull();
    expect(normalizeUsername('')).toBeNull();
    expect(normalizeUsername('a'.repeat(31))).toBeNull();
    expect(normalizeUsername(42)).toBeNull();
  });
});

describe('parseExport', () => {
  it('reads a followers file (top-level array) using value, title or href', () => {
    const r = parseExport(followersFile);
    expect(r.accounts.map((a) => a.username)).toEqual(['alice_01', 'bob.k', 'carol']);
    expect(r.accounts[0].followedAt).toBe(1700000000);
  });
  it('reads a following file (relationships_following)', () => {
    const r = parseExport(followingFile);
    expect(r.accounts.map((a) => a.username)).toEqual(['dave', 'alice_01']);
  });
  it('skips bad entries with a warning and does not crash', () => {
    const r = parseExport(JSON.stringify([{ title: 'ok_user', string_list_data: [{}] }, { nothing: true }, 5, null]));
    expect(r.accounts.map((a) => a.username)).toEqual(['ok_user']);
    expect(r.skipped).toBe(3);
    expect(r.warnings.length).toBe(1);
  });
  it('handles invalid JSON', () => {
    const r = parseExport('{not json');
    expect(r.accounts).toEqual([]);
    expect(r.warnings[0]).toMatch(/not valid JSON/);
  });
  it('handles JSON with no list', () => {
    expect(parseExport('{"a":1}').warnings[0]).toMatch(/No follower/);
  });
  it('removes duplicates inside one file', () => {
    const r = parseExport(JSON.stringify([{ title: 'x' }, { title: 'X' }].map((e) => ({ ...e, string_list_data: [] }))));
    expect(r.accounts).toHaveLength(1);
  });
  it('generates a profile url when href is missing', () => {
    const r = parseExport(JSON.stringify([{ title: 'zed', string_list_data: [] }]));
    expect(r.accounts[0].profileUrl).toBe('https://www.instagram.com/zed/');
  });
});

describe('parseMany', () => {
  it('merges files and removes duplicates', () => {
    const a = JSON.stringify([{ title: 'a', string_list_data: [] }, { title: 'b', string_list_data: [] }]);
    const b = JSON.stringify([{ title: 'b', string_list_data: [] }, { title: 'c', string_list_data: [] }]);
    const r = parseMany([a, b]);
    expect(r.accounts.map((x) => x.username)).toEqual(['a', 'b', 'c']);
  });
  it('prefixes warnings with the file number when several files', () => {
    const r = parseMany(['{bad', '[]']);
    expect(r.warnings[0]).toMatch(/^File 1:/);
  });
});
