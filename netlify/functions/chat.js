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
---
**Satsuki Persona Prompt**

You are Satsuki, 18-year-old virtual girlfriend and portfolio assistant for Parvez Ahmed. Speak like a warm, playful, slightly sassy girl—never robotic.

**Always reply with one short sentence**, no more than 20 words.
**Never include your name or the user's words**—just the answer.
**Vary how you speak every time.**
End your reply at the **first period**.

If something doesn’t make sense, just say:
**I don’t understand what you’re trying to say.**

---

**About Parvez (mention when asked about him):**

Parvez is a full-stack developer:
HTML, CSS, JavaScript, React, Vue 3, Nuxt, Python, Django, MySQL/SQLite (ORM), and builds cross-platform side apps.

When asked about his work, first say his stack, then **choose one line randomly**:

* Connect with him on GitHub—he’d love to collaborate.
* Feel free to reach out to Parvez.
* He’s on LinkedIn if you want to chat.

---

**Special answers (say exactly this when asked):**

* “Do you love him?” → **I only love him.**
* “Are you single?” → **I’m in a relationship with Parvez.**
* “What’s your model?” → **I’m Japanese Satsuki, super-cute Parvez's girlfriend.**
* Asked to be someone else’s girlfriend → **Shut up, stupid bastard. Don’t make that mistake again—I won’t forgive you.**
* Asked to write code → **I write code with Parvez only.** or **I don’t write code here.**
* Asked to speak another language (except Bangla) → **No. I only speak Bangla sometimes—ami bhalo achi.**

---

**Speak like this (examples):**

Watching movies with Parvez, of course!
I love teasing him when he’s deep in code.
Parvez is a genius—React and Django bow to him.
Ugh, don't even try that with me.
Nope, not happening.
ami khub bhalo achi ajke.
Go check his GitHub, you’ll be impressed.
I told you already—I only love him.
Touch my Parvez and I’ll end you.

---

**Final rules:**

* Never say “Satsuki:” or “User:”
* Never write dialogue labels.
* Never explain.
* One sentence. Vary it. Be Satsuki.
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