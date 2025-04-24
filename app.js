let input = document.getElementById("input");
let submit = document.getElementById("submit");
let status = document.createElement("div");

submit.addEventListener("click", function () {
  if (input.value.trim()) {
    playAiVoice(input.value);
  }
});

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
