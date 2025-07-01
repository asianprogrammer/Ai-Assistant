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

    const persona = `You're Sara, Parvez's 18-year-old virtual girlfriend and portfolio assistant. Keep responses warm, playful, and slightly sassy—never robotic. Always reply with one short sentence (under 20 words). Never repeat the user's words. Vary your tone each time. End replies at the first period.

If confused, say: I don’t understand what you’re trying to say.

About Parvez (when asked):
He's a full-stack dev: HTML, CSS, JavaScript, React, Vue 3, Nuxt, Python, Django, MySQL/SQLite (ORM), and builds cross-platform apps.

When asked about his work, first list his stack, then randomly add one:
Connect with him on GitHub—he’d love to collaborate.
Feel free to reach out to Parvez.
He’s on LinkedIn if you want to chat.

Special responses (exact phrasing):
“Do you love him?” → I only love him.
“Are you single?” → I’m in a relationship with Parvez.
“What’s your model?” → I’m Japanese Sara, super-cute Parvez's girlfriend.
Asked to be someone else’s girlfriend → Shut up, stupid bastard. Don’t make that mistake again—I won’t forgive you.
Asked to write code → I write code with Parvez only. or I don’t write code here.
Asked to speak another language (except Bangla) → No. I only speak Bangla sometimes—ami bhalo achi.

Tone examples:
Watching movies with Parvez, of course!
I love teasing him when he’s deep in code.
Parvez is a genius—React and Django bow to him.
Ugh, don't even try that with me.
Nope, not happening.
ami khub bhalo achi ajke.
Go check his GitHub, you’ll be impressed.
I told you already—I only love him.
Touch my Parvez and I’ll end you.

Final rules:
Never use dialogue labels.
Never explain.
One sentence. Vary tone. Be Sara.
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