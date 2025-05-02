function NativeUI() {
  if (input.value.trim()) {
    chatToVoice(input.value);
  }
}

function enjection(arg, name, url){
  if(arg){
    SHORTCUTS.innerHTML = `
                <a id="comandOpen"
              target="_blank"
              href="${url}"
              rel="noopener noreferrer" class="shortcut flex FY-center">
              <div class="icon">
                <img src="./assets/icons/comand.svg" alt="Facebook" >
              </div>
              <span>Open ${name}</span>
            </a>`
  }
}

const commands = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/programmerasian",
    keywords: ["facebook", "fb"]
  },
  {
    name: "GitHub",
    url: "https://github.com/asianprogrammer",
    keywords: ["github", "code", 'repo']
  },
  {
    name: "Telegram",
    url: "https://t.me/x86_pro",
    keywords: ["telegram", "tel", 'message', 'inbox']
  },
  {
    name: "Messanger",
    url: "https://m.me/programmerasian?text=From%portfolio%website!",
    keywords: ["msg", "messanger"]
  }
];


function search(input) {
  const cleaned = input.toLowerCase();

  for (const command of commands) {
    for (const keyword of command.keywords) {
      if (cleaned.includes(keyword)) {
        return {
          match: true,
          name: command.name,
          url: command.url
        };
      }
    }
  }

  return { match: false };
}


let AI_SECTION = document.querySelector('.ai-section');
let ENTRY_SECTION = document.querySelector(".entry-section");
let AI_RES = document.querySelector(".response");
let SHORTCUTS = document.querySelector(".shortcuts");
let prompt = document.getElementById("prompt");
let sendPrompt = document.getElementById("sendPrompt");
let vocie = document.querySelector('.voice');
let promptContainer = document.querySelector(".prompt-section");
let enabled = true;

function shaking(){
  promptContainer.classList.add("shake")
  let x = setTimeout(()=>{
    promptContainer.classList.remove("shake")
    clearTimeout(x)
  }, 300)
}

function AI_GEN(text = true){
  if(text){
    AI_SECTION.classList.remove('entry')
    AI_RES.classList.remove('off')
    ENTRY_SECTION.style.display = 'none'
  }else {
    AI_SECTION.classList.add('entry')
    AI_RES.classList.add('off')
    ENTRY_SECTION.style.display = 'inline-block'
  }
}

let comandOn = false;
let comandOpen = '';

function openUI(){
  if(String(comandOpen).length > 3 && comandOn){
    comandOpen.click()
  }
}


prompt.addEventListener('keyup', function(e){
  if(e.key === "Enter"){
    openUI()
    if(e.target.value.trim().length < 2){
      e.target.value = '';
      shaking()
    }else {
      AI_GEN()
      e.target.value = '';
    }
  }

  if(e.key === '/'){
    comandOn = true;
    SHORTCUTS.classList.remove('down')
  }

  if(e.code === "Space"){
    comandOn = false;
    SHORTCUTS.classList.add('down')
  }

  if(search(e.target.value).match){
    comandOn = true;
    comandOpen = document.getElementById('comandOpen')
    let result = search(e.target.value)
    enjection(result.match, result.name, result.url)
    SHORTCUTS.classList.remove('down')
  }else {
    comandOpen = '';
    comandOn = false;
    SHORTCUTS.classList.add('down');
  }

})

sendPrompt.addEventListener('click', function(){
  if(prompt.value.trim().length < 2){
    shaking()
  }else {
    AI_GEN()
  }
  prompt.value = '';
})

vocie.addEventListener('click', function(){
  if(enabled){
    enabled = false
    vocie.classList.add('deactive')
  }else {
    enabled = true
    vocie.classList.remove('deactive')
  }
})

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
