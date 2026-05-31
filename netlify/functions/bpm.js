exports.handler = async function(event) {
  const { bpm, genre } = event.queryStringParameters || {};
  if (!bpm) return { statusCode: 400, body: JSON.stringify({ error: "bpm required" }) };

  const slug = genre && genre !== "all"
    ? `https://getsongbpm.com/tempo/${bpm}-bpm-${genre}`
    : `https://getsongbpm.com/tempo/${bpm}-bpm`;

  try {
    const res = await fetch(slug, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RhythmRun/1.0)",
        "Accept": "text/html",
      }
    });

    if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: "fetch failed", status: res.status }) };

    const html = await res.text();

    // Parse song list: pattern is "SONG_TITLE\nARTIST_NAME" inside list items
    const songs = [];
    // Match <a href="/song/...">TITLE</a> and nearby artist text
    const songRe = /<a[^>]+href="\/song\/[^"]*"[^>]*>([^<]+)<\/a>/g;
    const artistRe = /<a[^>]+href="\/artist\/[^"]*"[^>]*>([^<]+)<\/a>/g;

    let sm, titles = [], artists = [];
    while ((sm = songRe.exec(html)) !== null) titles.push(sm[1].trim());
    let am;
    while ((am = artistRe.exec(html)) !== null) artists.push(am[1].trim());

    for (let i = 0; i < Math.min(titles.length, artists.length, 30); i++) {
      if (titles[i] && artists[i]) {
        songs.push({ title: titles[i], artist: artists[i], bpm: parseInt(bpm) });
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songs, source: slug }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
