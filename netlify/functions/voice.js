exports.handler = async function (event, context) {
  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "OK" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.VOICE_API_KEY;
  if (!apiKey) {
    console.error("Missing VOICE_API_KEY"); // debug log
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "Server misconfiguration" }),
    };
  }

  try {
    // Parse JSON—there is no binary blob here, just text to speak
    const { text } = JSON.parse(event.body);
    if (!text) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "Missing 'text'" }),
      };
    }

    // 1️⃣ Call your external TTS service
    const ttsRes = await fetch("https://weekly-aprilette-asianprogrammer-b2a7bac6.koyeb.app/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ text }),
    });
    if (!ttsRes.ok) {
      const errTxt = await ttsRes.text();
      console.error("TTS API error:", errTxt);
      return {
        statusCode: ttsRes.status,
        headers: CORS,
        body: JSON.stringify({ error: "TTS API failed", detail: errTxt }),
      };
    }

    // 2️⃣ Read the audio bytes
    const audioBuffer = await ttsRes.arrayBuffer(); // get ArrayBuffer :contentReference[oaicite:5]{index=5}

    // 3️⃣ Return as Base64 with correct headers
    return {
      statusCode: 200,
      headers: {
        ...CORS,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
      body: Buffer.from(audioBuffer).toString("base64"),
      isBase64Encoded: true, // tell Netlify it's binary :contentReference[oaicite:6]{index=6}
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: err.message,
      }),
    };
  }
};
