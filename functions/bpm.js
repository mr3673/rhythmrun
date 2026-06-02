const API_KEY = '01d95501999cadb1d1c2f45f7f843072';

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  }

  const url = new URL(context.request.url);
  const q = url.searchParams.get('q') || '';
  if (!q) return json({ search: [] });

  try {
    const apiUrl = `https://api.getsongbpm.com/search/?api_key=${API_KEY}&type=both&lookup=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return json(data);
  } catch {
    return json({ search: [] }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
