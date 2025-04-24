let input = document.getElementById("input");
let submit = document.getElementById("submit");
let status = document.createElement("div");
status.id = "status";
document.body.appendChild(status);

submit.addEventListener("click", function () {
  if (input.value.trim()) {
    status.textContent = "Processing your request...";
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
      status.textContent = "Converting text to speech...";
      playAiVoice(data.response);
    })
    .catch((error) => {
      console.error("Error in chat function:", error);
      status.textContent = "Error: Could not process your request.";
    });
}

function playAiVoice(text) {
  fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => {
      if (!res.ok) {
        // Extract error details if available
        return res
          .json()
          .then((errorData) => {
            throw new Error(
              `Voice API error: ${res.status} - ${
                errorData.error || "Unknown error"
              }`
            );
          })
          .catch(() => {
            // If error parsing fails, just throw the status
            throw new Error(`Voice API error: ${res.status}`);
          });
      }
      // The key fix - properly handle the response format
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        status.textContent = "Error: Could not play the audio.";
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        status.textContent = "";
      };

      audio.oncanplaythrough = () => {
        status.textContent = "Playing audio...";
      };

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error("Audio play error:", error);
          if (error.name === "NotAllowedError") {
            status.textContent =
              "Audio blocked. Please interact with the page first.";
          }
        });
      }
    })
    .catch((err) => {
      console.error("Voice error:", err);
      status.textContent =
        "Error: There was a problem generating the voice audio.";
    });
}
