/**
 * 和 (wa) design tokens.
 * Sumi (墨, ink black) ground, washi (和紙, paper) text, shu (朱, vermilion) accent like a hanko seal.
 */
export const colors = {
  sumi: '#0F0E0D', // page
  sumi2: '#171513', // cards
  sumi3: '#201D1A', // raised
  line: '#2E2A25',
  washi: '#EFE7D8', // main text
  washi2: '#A39A8B', // secondary text
  washi3: '#8A8273', // faint text (kept readable on sumi)
  shu: '#D9432B', // vermilion (accent / danger)
  shuSoft: 'rgba(217,67,43,0.14)',
  ai: '#5B7DB1', // indigo
  matcha: '#8FA67A', // green
  kin: '#C9A45C', // gold
  sakura: '#E3B1B6', // pink
} as const;

export const fonts = {
  serif: 'ShipporiMincho_500Medium',
  serifBold: 'ShipporiMincho_700Bold',
  sans: 'ZenKakuGothicNew_400Regular',
  sansMedium: 'ZenKakuGothicNew_500Medium',
  sansBold: 'ZenKakuGothicNew_700Bold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Japanese UI uses small, almost square corners. */
export const radius = { sm: 4, md: 8, lg: 14 } as const;

const HANKO_PALETTE = [colors.shu, colors.ai, colors.matcha, colors.kin, colors.sakura];

/** Stable color per username so an avatar never changes. */
export function hankoColor(username: string): string {
  let h = 0;
  for (let i = 0; i < username.length; i++) h = (h * 31 + username.charCodeAt(i)) >>> 0;
  return HANKO_PALETTE[h % HANKO_PALETTE.length];
}
