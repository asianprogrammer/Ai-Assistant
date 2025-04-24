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
  // Add a loading indicator if needed
  console.log("Generating voice...");

  fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Voice API error: ${res.status}`);
      }
      // For base64 encoded response
      return res.json().then((data) => {
        // Convert base64 to binary
        const binaryString = atob(data.body || "");
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      });
    })
    .then((buffer) => {
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      // Add event handlers for better error handling
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        alert("Could not play the audio. Please try again.");
      };

      // Clean up the URL object when done
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };

      // Play the audio
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error("Audio play error:", error);
          // Handle autoplay restrictions
          if (error.name === "NotAllowedError") {
            alert(
              "Audio playback was blocked. Please interact with the page first."
            );
          }
        });
      }
    })
    .catch((err) => {
      console.error("Voice error:", err);
      alert("There was a problem generating the voice audio.");
    });
}
