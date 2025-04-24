let input = document.getElementById("input");
let submit = document.getElementById("submit");

submit.addEventListener("click", function () {
  if (input.value.trim()) {
    chatToVoice(input.value);
  }
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
    .catch((error) => {
      console.error("Error in chat function:", error);
      // Provide user feedback about the error
      alert("Sorry, there was a problem processing your request.");
    });
}

function playAiVoice(text) {
  console.log("Generating voice...");

  fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => {
      console.log("Voice API response status:", res.status);
      if (!res.ok) {
        return res
          .json()
          .then((data) => {
            throw new Error(
              `Voice API error (${res.status}): ${
                data.error || "Unknown error"
              }`
            );
          })
          .catch((e) => {
            throw new Error(`Voice API error: ${res.status}`);
          });
      }
      return res.arrayBuffer();
    })
    .then((buffer) => {
      console.log("Audio data received, size:", buffer.byteLength);
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
      };

      audio.oncanplaythrough = () => {
        console.log("Audio ready to play");
      };

      audio.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    })
    .catch((err) => {
      console.error("Voice error:", err);
    });
}
