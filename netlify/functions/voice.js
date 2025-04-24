exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.VOICE_API_KEY;

  // Check if API key is configured
  if (!apiKey) {
    console.error("VOICE_API_KEY environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server configuration error - missing API key",
      }),
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

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    console.log("Sending request to TTS API with text length:", text.length);

    try {
      const ttsResponse = await fetch(
        "https://weekly-aprilette-asianprogrammer-b2a7bac6.koyeb.app/tts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        console.error("TTS API Error:", ttsResponse.status, errorText);
        return {
          statusCode: ttsResponse.status,
          body: JSON.stringify({
            error: "TTS API failed",
            status: ttsResponse.status,
            detail: errorText,
          }),
        };
      }

      console.log("TTS API response received, status:", ttsResponse.status);
      const audioBuffer = await ttsResponse.arrayBuffer();
      console.log("Audio buffer received, size:", audioBuffer.byteLength);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'inline; filename="speech.mp3"',
        },
        body: Buffer.from(audioBuffer).toString("base64"),
        isBase64Encoded: true,
      };
    } catch (fetchError) {
      // Handle fetch-specific errors
      if (fetchError.name === "AbortError") {
        console.error("Fetch request timed out");
        return {
          statusCode: 504,
          body: JSON.stringify({
            error: "Gateway Timeout",
            message: "TTS API request timed out",
          }),
        };
      }

      console.error("Fetch error:", fetchError.message);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Bad Gateway",
          message: fetchError.message,
        }),
      };
    }
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};
