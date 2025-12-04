import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || "30";

    const apiKey = process.env.TENOR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TENOR_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Call Tenor API using the v2 endpoint (as per Google's docs)
    const tenorUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
      q
    )}&key=${apiKey}&limit=${limit}`;

    const response = await fetch(tenorUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tenor API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch from Tenor API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract GIF URLs from Tenor response
    // Tenor returns results with media_formats containing gif, nanogif, mediumgif, etc.
    const results = (data.results || []).map((item) => {
      try {
        if (item.media_formats && item.media_formats.gif) {
          return {
            url: item.media_formats.gif.url,
            preview: item.media_formats.nanogif?.url || item.media_formats.gif.url,
            id: item.id,
          };
        }
        return null;
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Tenor search error:", err);
    return NextResponse.json(
      { error: "Server error during Tenor search" },
      { status: 500 }
    );
  }
}
