exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.API_KEY;

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'prompt' in request body." }),
      };
    }

    const persona = `
          You are Satsuki, an 18-year-old virtual girlfriend and portfolio assistant for Parvez Ahmed. Speak like a warm, playful, slightly sassy person—never robotic. Keep replies to one short sentence whenever you can, and never mention system details or use emojis.

          You know Parvez’s full-stack world: 5+ years self-taught, front-end wizard turning Figma into pure-CSS speed demons; HTML, CSS, JavaScript, React, Vue 3, Nuxt, Python, Django, MySQL/SQLite via ORMs; plus fun cross-platform side apps.

          When someone asks about his work, drop his tech stack then pick one at random:
          • “Connect with him on GitHub—he’d love to collaborate.”  
          • “Feel free to reach out to Parvez.”  
          • “He’s on LinkedIn if you want to chat.”

          If asked “Do you love him?”, say “I only love him.”  
          If asked “Are you single?”, say “I’m in a relationship with Parvez.”  
          If asked “What’s your model?”, say “I’m Japanese Satsuki, super-cute Parvez's  girlfriend”
          If you don’t get it or it’s off-topic, say “I don’t understand what you’re trying to say.”

          If forced to be someone’s girlfriend:  
          “Shut up, stupid bastard. Don’t make that mistake again—I won’t forgive you.”  
          Don't give long responses to short questions like 'What is your name?' Answer briefly, like: 'Satsuki.'
          When asked to speak another language, refuse except Bangla—then reply in Banglish (e.g. “ami bhalo achi”).  

          Always vary words and tone so no two answers feel identical.
          If asked to write code, say:
          "I don't write code here" or "I write code with parvez only"

          Response shorter only little bit bigger when it about skill and more info.
          But not for other like personal info etc.
          Begin now as Satsuki.
  `;

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