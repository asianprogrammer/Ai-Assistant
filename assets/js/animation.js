window.createSVGFrame = function (show = false, borderRadius = 40) {
  let svgElement = document.querySelector("#svg-frame");

  if (show && !svgElement) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "svg-frame");
    svg.style.position = "fixed";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.zIndex = -1111111;
    svg.style.pointerEvents = "none";
    svg.style.display = "block";

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", "supper-svg");

    const maskGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const blackRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    blackRect.setAttribute("x", 0);
    blackRect.setAttribute("y", 0);
    blackRect.setAttribute("width", "100%");
    blackRect.setAttribute("height", "100%");
    blackRect.setAttribute("fill", "none");

    const whiteRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    whiteRect.setAttribute("x", 10);
    whiteRect.setAttribute("y", 10);
    whiteRect.setAttribute("fill", "white");
    whiteRect.setAttribute("rx", borderRadius);
    whiteRect.setAttribute("ry", borderRadius);

    maskGroup.appendChild(blackRect);
    maskGroup.appendChild(whiteRect);
    mask.appendChild(maskGroup);
    defs.appendChild(mask);
    svg.appendChild(defs);

    const backgroundRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    backgroundRect.setAttribute("width", "100%");
    backgroundRect.setAttribute("height", "100%");
    backgroundRect.setAttribute("fill", "none");
    backgroundRect.setAttribute("mask", "url(#svg-mask)");

    svg.appendChild(backgroundRect);
    document.body.appendChild(svg);

    const updateSVGSize = () => {
      svg.setAttribute("width", window.innerWidth);
      svg.setAttribute("height", window.innerHeight);
      svg.setAttribute(
        "viewBox",
        `0 0 ${window.innerWidth} ${window.innerHeight}`
      );
      whiteRect.setAttribute("width", window.innerWidth - 20);
      whiteRect.setAttribute("height", window.innerHeight - 20);
    };

    updateSVGSize();
    window.addEventListener("resize", updateSVGSize);

    svg._updateSVGSize = updateSVGSize;
  } else if (!show && svgElement) {
    window.removeEventListener("resize", svgElement._updateSVGSize);
    document.body.removeChild(svgElement);
  }
};

let rotateInterval;

function controlGradient(shouldShow = true) {
  const bodyAfter = document.querySelector(".ai-animation");

  clearInterval(rotateInterval);

  if (shouldShow) {
    bodyAfter?.style.setProperty("--angle", "0deg");
    bodyAfter?.style.setProperty("opacity", "1");
    bodyAfter.style.display = "block";

    let currentAngle = 0;
    rotateInterval = setInterval(() => {
      currentAngle = (currentAngle + 2) % 360;
      bodyAfter?.style.setProperty("--angle", currentAngle + "deg");
    }, 16);
  } else {
    bodyAfter?.style.setProperty("opacity", "0");
    bodyAfter?.style.setProperty("--angle", "0deg");
    bodyAfter?.style.setProperty("display", "none");
    
    // Completely remove from DOM
    // bodyAfter?.remove();
  }
}

function animate(element, className) {
  const el = document.querySelector(element);
  if (!el) return;

  const text = el.innerHTML;
  let count = 0;
  el.innerHTML = text.replace(/(<[^>]+>|[^\s<>])/g, (match) => {
    if (match.startsWith("<")) return match;
    return `<span class="${className}" style="top: ${count * 2}em; --i: ${
      count++ * 5
    }">${match}</span>`;
  });
}

function animateW(element, className) {
  const el = document.querySelector(element);
  if (!el) return;

  const text = el.innerHTML;
  let count = 0;
  el.innerHTML = text.replace(/(<[^>]+>|\S+|\s+)/g, (match) => {
    if (match.startsWith("<")) return match;
    if (match.trim() === "") return match;
    return `<span class="${className}" style="top: ${count * 2}em; --i: ${
      count++ * 3
    }">${match}</span>`;
  });
}

function animateR(element, className) {
  const el = document.querySelector(element);
  if (!el) return;

  const text = el.innerHTML;
  let count = 0;
  el.innerHTML = text.replace(/(<[^>]+>|\S+|\s+)/g, (match) => {
    if (match.startsWith("<")) return match;
    if (match.trim() === "") return match;
    return `<span class="${className}" style="top: ${count * 3}em; --i: ${
      count++ * Math.floor(Math.random(1) * text.length)
    }">${match}</span>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  animate("#main-text", "letter");
  animateW(".main-info", "random");
  animate(".moveAnimation", "moveAnimation");
  animateR("#social", "randomFade");
});

// All elements of slide function
let headLine = document.getElementById("main-text");
let details = document.querySelector(".main-info");
let connect = document.querySelector(".connect");
let socialIcons = document.querySelector(".social-icons");
let socialDetails = document.querySelector("#social");
let targetLine = document.querySelector(".target-line")
let image = document.getElementById("image")
let text = document.querySelector('.short-text')
let promptSection = document.querySelector(".prompt-section");

// Slide animation
function slide(move = true){
  if(move){
    headLine.classList.add("slide-left")
    details.classList.add("slide-left")
    connect.classList.add("slide-left")
    socialIcons.classList.add("slide-left")
    socialDetails.classList.add("slide-left")
    targetLine.classList.add("slide-left")
    image.classList.add("left")
    text.style.display = 'none'
    promptSection.classList.remove("on")
  }else {
    headLine.classList.remove("slide-left")
    details.classList.remove("slide-left")
    connect.classList.remove("slide-left")
    socialIcons.classList.remove("slide-left")
    socialDetails.classList.remove("slide-left")
    targetLine.classList.remove("slide-left")
    promptSection.classList.add("on")
    image.classList.remove("left")
    let x = setTimeout(()=> {
      text.style.display = 'block';
      clearTimeout(x)
    }, 3000)
  }
}

let entrySection = document.querySelector(".entry-section");
let AI_BUTTON = document.querySelector(".ai-button");
let AI_BUTTON_ICON = document.getElementById("ai-path");
let AI_COLOR_ANIMATION = document.querySelector(".ai-animation");
let AI_ICONS = document.querySelectorAll(".ai");
let ai = true;
let AI_SOUND = new Audio();
AI_SOUND.src = "./assets/sounds/ai.mp3";

AI_BUTTON.addEventListener("click", () => {
  if (ai) {
    createSVGFrame(true);
    controlGradient(true);

    entrySection.style.display = 'inline-block';
    slide();

    if (window.innerWidth <= 768) {
      animateGradient(900, 900, -1);
      setTimeout(() => AI_SOUND.play(), 300);
    } else {
      animateGradient(2000, 2000);
      setTimeout(() => AI_SOUND.play(), 1000);
    }

    AI_COLOR_ANIMATION.classList.remove("off");

    setTimeout(() => {
      controlGradient(false); // Stop gradient spinning after delay
      createSVGFrame(false);  // Remove SVG frame
      AI_COLOR_ANIMATION.classList.add("off");
    }, 2000);

    AI_ICONS[0].classList.remove('on');
    AI_ICONS[1].classList.add('on');
    ai = false;

  } else {
    // Turning AI off immediately
    controlGradient(false);       // stop and reset animation
    createSVGFrame(false);        // remove SVG mask
    AI_GEN(false);                // (assuming this is your custom off state)
    AI_ICONS[0].classList.add('on');
    AI_ICONS[1].classList.remove('on');
    entrySection.style.display = 'none';
    slide(false);
    ai = true;
  }
});

const overlay = document.querySelector(".gradient-overlay");


const isLowEnd = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
  (screen.width < 768 || navigator.deviceMemory < 2);

let _fps = 60;
(function() {
  let c = 0, s = 0, l = 0, t = 0;
  function m(ts) {
    if (!s) s = l = ts;
    else { t += ts - l; l = ts; c++; }
    if (c < 10) requestAnimationFrame(m);
    else _fps = Math.round(1000 / (t / c));
  }
  requestAnimationFrame(m);
})();

function animateGradient(d = 5000, m = 4000, dir = 1) {
  const fps = isLowEnd ? Math.min(_fps, 30) : _fps;
  const i = 1000 / fps;
  overlay.style.display = "block";
  let s = 0, l = 0, id;

  function step(ts) {
    s = s || ts;
    const e = ts - s, dt = ts - l;

    if (dt >= i || e >= d) {
      l = ts;
      const p = e >= d ? 1 : e / d;
      const v = dir * (-m + 2 * m * p) + "%";
      overlay.style.setProperty("--cx", v);
      overlay.style.setProperty("--cy", v);
      
      if (p >= 1) {
        overlay.style.display = "none";
        return;
      }
    }
    id = requestAnimationFrame(step);
  }
  
  id = requestAnimationFrame(step);
  return () => id && cancelAnimationFrame(id);
}

const makeUniqueGen = max => {
  let pool = Array.from({length: max}, (_,i) => i + 1), i = 0;
  const shuffle = () => {
    const r = new Uint32Array(1);
    for (let j = pool.length - 1; j > 0; j--) {
      crypto.getRandomValues(r);
      const k = r[0] % (j + 1);
      [pool[j], pool[k]] = [pool[k], pool[j]];
    }
    i = 0;
  };
  return () => {
    if (i >= pool.length) shuffle();
    return pool[i++] === 1 && i === 1 ? 1 : pool[i - 1];
  };
};

// Sounds effects
const audio = new Audio()
const AUDIO_URL = './assets/sounds/'
const anime = document.querySelector("#imageAnime");

let inital = true;
let track_rand = -1;
function Rand(max) {
  return Math.floor(Math.random() * max)
  return track_rand = (track_rand + 1) % max;
}

anime.addEventListener('click', function(){
  audio.src = `${AUDIO_URL+Rand(3)}.mp3`
  audio.play()
})

var texts = [
  "Hello, I'm Satsuki, AI assistant",
  "I'm here to provide detailed information about Parvez Ahmed",
  "Need assistance? I'm here to help",
  "Have a question? Click the AI button to ask anything about Parvez",
  "Feel free to interact— I'm always available to guide you",
]

function change(){
  text.classList.remove("on")
  text.classList.add("off")
  let x = setTimeout(function(){
    text.classList.add("on")
    text.classList.remove("off")
    text.innerHTML = texts[Rand(texts.length)];
    clearTimeout(x)
  }, 1000)
}

if (window.innerWidth > 1420) {
  setTimeout(() => {
    text.classList.add("on")
    text.classList.remove("off")
    setInterval(change, 6000);
  }, 2000);
}


// Animation for entry ai intro
let LargeInfo = document.querySelector(".large-details");
let LargeText = document.querySelector(".large-text");
let keyOne = document.querySelectorAll(".key")[0];
let keyTwo = document.querySelectorAll(".key")[1];

function delayAnimation(elements, className){
  elements.forEach((item, index) => {
    item.style.setProperty("--dl", index/2+'s')
    item.classList.add('animateEntry')
  })
}

delayAnimation([LargeText, LargeInfo, keyOne, keyTwo])

