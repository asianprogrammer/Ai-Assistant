function injection(arg, name, url){
  if(arg){
    SHORTCUTS.innerHTML = `
                <a id="commandOpen"
              target="_blank"
              href="${url}"
              rel="noopener noreferrer" class="shortcut flex FY-center">
              <div class="icon">
                <img src="./assets/icons/internet.svg" alt="Facebook" >
              </div>
              <span>Open ${name}</span>
            </a>`
  }
}

const commands = [
  {
    name: "GitHub",
    url: "https://github.com/asianprogrammer",
    keywords: ["/github", "/code", '/repo', '/git', '/']
  },
  {
    name: "Telegram",
    url: "https://t.me/x86_pro",
    keywords: ["/telegram", "/tel", '/message', '/inbox', '/te', '/msg', "/connect"]
  },
];

function search(input) {
    const cleaned = input.toLowerCase();

    if (cleaned === '/') {
        return {
                  match: true,
                  name: commands[0].name,
                  url: commands[0].url
              };
    }

    if (cleaned.startsWith('/')) {
        for (const command of commands) {
            for (const keyword of command.keywords) {
                if (cleaned === keyword) {
                    return {
                        match: true,
                        name: command.name,
                        url: command.url
                    };
                }
            }
        }
    }

    return { match: false };
}

let AI_SECTION = document.querySelector('.ai-section');
let AI_TEXT = document.querySelector(".ai-response");
let ENTRY_SECTION = document.querySelector(".entry-section");
let AI_RES = document.querySelector(".response");
let SHORTCUTS = document.querySelector(".shortcuts");
let prompt = document.getElementById("prompt");
let sendPrompt = document.getElementById("sendPrompt");
let voice = document.querySelector('.voice');
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

let commandOn = false;
let commandOpen = '';

function openUI(){
  if(String(commandOpen).length > 3 && commandOn){
    commandOpen.click()
  }
}

// On key press handle function
prompt.addEventListener('keyup', function(e){
  let input = e.target.value.trim()
  if(e.key === "Enter"){
    AI_TEXT.innerHTML = "I am thinking. Wait some time"
    AI_TEXT.style.display = 'none';
    openUI()
    if(input.length < 2){
      e.target.value = '';
      shaking()
    }else {
      AI_GEN()
      if(!commandOn){
          AI_TEXT.style.display = 'block';
        chat(input).then(response => {
          AI_TEXT.innerHTML = response.response;
          playAiVoice(response.response)
        });
      }
      e.target.value = '';
    }
  }

  if(e.key === '/'){
    commandOn = true;
    SHORTCUTS.classList.remove('down')
  }

  if(e.code === "Space"){
    commandOn = false;
    SHORTCUTS.classList.add('down')
  }

  if(search(e.target.value).match){
    commandOn = true;
    commandOpen = document.getElementById('commandOpen')
    let result = search(e.target.value)
    injection(result.match, result.name, result.url)
    SHORTCUTS.classList.remove('down')
  }else {
    commandOpen = '';
    commandOn = false;
    SHORTCUTS.classList.add('down');
  }

})

// On button click handle function
sendPrompt.addEventListener('click', function(){
  AI_TEXT.style.display = 'none';
  AI_TEXT.innerHTML = "Wait I am saying..";
  let input = prompt.value.trim();
  if(prompt.value.trim().length < 2){
    shaking()
  }else {
    new Audio('./assets/sounds/pew.mp3').play();
    AI_GEN()
    if(!commandOn){
      AI_TEXT.style.display = 'block';
      chat(input).then(response => {

        AI_TEXT.innerHTML = response.response;
        playAiVoice(response.response)
      });
    }
  }
  prompt.value = '';
})

voice.addEventListener('click', function(){
  if(enabled){
    enabled = false
    voice.classList.add('deactivate')
  }else {
    enabled = true
    voice.classList.remove('deactivate')
  }
})

function chat(prompt) {

  if (['i hate you', 'you are noob', 'fuck', 'stupid'].includes(prompt.toLowerCase())) {
    let T = setTimeout(function(){
      new Audio('./assets/sounds/tuco-get-out.mp3').play()
      clearTimeout(T)
    }, 300)
    return 0;
  }

  if (['i love you', 'i want you'].includes(prompt.toLowerCase())) {
    let TT = setTimeout(function(){
      new Audio('./assets/sounds/ami-bishwas-kori-na.mp3').play()
      clearTimeout(TT)
    }, 500)
  }

  return fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .catch((error) => {
      console.error("Error in chat function:", error);
      alert("Sorry, there was a problem processing your request.");
    });
}


let currentAudio = null;

function playAiVoice(text) {
  if(!enabled) { return false}
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  fetch("/.netlify/functions/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => {
      if (!res.ok) {
        return res
          .json()
          .then((data) => {
            throw new Error(
              `Voice API error (${res.status}): ${data.error || "Unknown error"}`
            );
          })
          .catch(() => {
            throw new Error(`Voice API error: ${res.status}`);
          });
      }
      return res.arrayBuffer();
    })
    .then((buffer) => {
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
      };

      currentAudio = audio;
      audio.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    })
    .catch((err) => {
      console.error("Voice error:", err);
    });
}
