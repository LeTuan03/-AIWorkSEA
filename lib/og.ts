// Font loading for next/og social cards.
//
// The default font bundled with next/og does not cover Vietnamese diacritics,
// so text like "Việc làm · Đông Nam Á" would render as tofu (□). We fetch the
// brand face (Space Mono, which ships a Vietnamese subset) from Google Fonts,
// scoped to exactly the characters we draw so the download stays tiny.
//
// Everything is wrapped so a network hiccup degrades to the default font
// instead of failing image generation outright.

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

async function fetchGoogleFont(
  weight: 400 | 700,
  text: string,
): Promise<OgFont | null> {
  try {
    const params = new URLSearchParams({
      family: `Space Mono:wght@${weight}`,
      // Subset to just the glyphs we render; also forces a single font file.
      text,
    });
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?${params.toString()}`,
      {
        headers: {
          // A UA that doesn't advertise woff2 support makes Google serve a TTF;
          // Satori can't parse woff2 (throws "Unsupported OpenType signature").
          "User-Agent": "Mozilla/5.0 (Windows NT 5.1)",
        },
      },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    // Prefer the truetype src; never hand a woff2 url to Satori.
    const url =
      css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url);
    if (!fontRes.ok) return null;
    return {
      name: "Space Mono",
      data: await fontRes.arrayBuffer(),
      weight,
      style: "normal",
    };
  } catch {
    return null;
  }
}

// Load the 400 + 700 weights subset to `text`. Returns [] on any failure so
// callers can spread it into ImageResponse and fall back to the default font.
export async function loadOgFonts(text: string): Promise<OgFont[]> {
  const fonts = await Promise.all([
    fetchGoogleFont(700, text),
    fetchGoogleFont(400, text),
  ]);
  return fonts.filter((f): f is OgFont => f !== null);
}
