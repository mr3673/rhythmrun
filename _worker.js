const BPM_API_KEY = '01d95501999cadb1d1c2f45f7f843072';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/bpm') {
      const q = url.searchParams.get('q') || '';
      if (!q) return Response.json({ search: [] });
      try {
        const res = await fetch(
          `https://api.getsongbpm.com/search/?api_key=${BPM_API_KEY}&type=both&lookup=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        return Response.json(data);
      } catch {
        return Response.json({ search: [] });
      }
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  }
};
