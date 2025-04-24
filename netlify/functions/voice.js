// netlify/functions/voice.js
exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.VOICE_API_KEY;

  if (!apiKey) {
    console.error("Missing API key configuration");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'text' in request body." }),
      };
    }

    // Limit text length to prevent timeouts
    const limitedText = text.slice(0, 500); // Limit to 500 chars for testing

    console.log("Calling TTS API with text length:", limitedText.length);

    const ttsResponse = await fetch(
      "https://weekly-aprilette-asianprogrammer-b2a7bac6.koyeb.app/tts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey, // Make sure this matches exactly what your Python backend expects
          Origin: "https://rxt.netlify.app", // Add your actual domain
        },
        body: JSON.stringify({ text: limitedText }),
      }
    );

    console.log("TTS API response status:", ttsResponse.status);

    if (!ttsResponse.ok) {
      let errorDetail = "";
      try {
        const errorText = await ttsResponse.text();
        console.error("TTS API Error:", errorText);
        errorDetail = errorText;
      } catch (e) {
        console.error("Could not read error response");
      }

      return {
        statusCode: ttsResponse.status,
        body: JSON.stringify({
          error: "TTS API failed",
          status: ttsResponse.status,
          detail: errorDetail,
        }),
      };
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log("Audio buffer received, size:", audioBuffer.byteLength);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
      body: Buffer.from(audioBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Serverless Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};
