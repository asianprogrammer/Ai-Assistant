let input = document.getElementById("input");
let submit = document.getElementById("submit");

submit.addEventListener("click", function () {
  chatToVoice(input.value);
});

function chatToVoice(prompt) {
  fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("AI says:", data.response);
      playAiVoice(data.response);
    })
    .catch((error) => console.error("Error:", error));
}

async function playAiVoice(text) {
  // 1️⃣ Call TTS API to get a Blob from function
  const response = await fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  // 2️⃣ Read raw bytes
  const arrayBuffer = await response.arrayBuffer();
  // 3️⃣ Create a playable Blob
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play(); // may reject if user gesture required :contentReference[oaicite:4]{index=4}
}
