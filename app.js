let input = document.getElementById('input')
let submit = document.getElementById('submit')

submit.addEventListener('click', function() {
    console.log(input.value)
    fetch("/.netlify/functions/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Tell me something interesting about space.",
        }),
      })
        .then(res => res.json())
        .then(data => console.log("AI says:", data.response));
})