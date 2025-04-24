let input = document.getElementById('input')
let submit = document.getElementById('submit')

submit.addEventListener('click', function() {
    console.log(input.value)
    fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Tell me a joke." }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => console.log("AI says:", data.response))
        .catch((error) => console.error("Error:", error));
})