let input = document.getElementById("input");
let submit = document.getElementById("submit");

submit.addEventListener("click", function () {});

function chatToVoice(prompt) {
  fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt}),
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

function playAiVoice(text) {
  fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    })
    .catch((err) => console.error("Voice error:", err));
}
