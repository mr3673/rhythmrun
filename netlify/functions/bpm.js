exports.handler = async function(event) {
  const API_KEY = "01d95501999cadb1d1c2f45f7f843072";
  const BASE = "https://api.getsongbpm.com";

  const { endpoint, bpm, id, limit } = event.queryStringParameters || {};

  let url;
  if (endpoint === "tempo") {
    url = `${BASE}/tempo/?api_key=${API_KEY}&bpm=${bpm}&limit=${limit || 40}`;
  } else if (endpoint === "song") {
    url = `${BASE}/song/?api_key=${API_KEY}&id=${id}`;
  } else {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid endpoint" }) };
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
