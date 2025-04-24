exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.MY_SECRET_API_KEY;

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'prompt' in request body." }),
      };
    }

    const persona = "You are a helpful assistant.";

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          { role: "system", content: persona },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch from Mistral AI" }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};