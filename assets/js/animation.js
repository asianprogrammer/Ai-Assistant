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

  if (shouldShow) {
    bodyAfter.style.setProperty("--angle", "0deg");
    bodyAfter.style.setProperty("opacity", "1");

    let currentAngle = 0;
    clearInterval(rotateInterval);

    rotateInterval = setInterval(() => {
      currentAngle += 1;
      if (currentAngle >= 350) {
        currentAngle = 0;
      }
      bodyAfter.style.setProperty("--angle", currentAngle + "deg");
    }, 16); // about 60fps = 1000ms/60 ≈ 16ms
  } else {
    clearInterval(rotateInterval);
    bodyAfter.style.setProperty("opacity", "0");
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

let AI_BUTTTON = document.querySelector(".ai-button");
let AI_COLOR_ANIMTION = document.querySelector(".ai-animation");
let EFFECT = document.querySelector(".next-lv");
let AI_SOUND = new Audio()
AI_SOUND.src = './assets/sounds/ai.mp3';


AI_BUTTTON.addEventListener("click", () => {
  createSVGFrame(true);
  controlGradient(true);

  // EFFECT.classList.add("on");
  // let time = setTimeout(() => {
  //   EFFECT.classList.remove("on");
  //   clearTimeout(time);
  // }, 2000);

  if(window.innerWidth <  700) {
    AI_SOUND.play()
    animateGradient(900, 900, -1);
  }else {
    animateGradient(2000, 2000);
    let x = setTimeout(()=> {
      AI_SOUND.play()
    }, 1000)
  }

  AI_COLOR_ANIMTION.classList.remove("off");
  let x = setTimeout(() => {
    controlGradient(false);
    createSVGFrame(false);
    AI_COLOR_ANIMTION.classList.add("off");
    clearTimeout(x);
  }, 2000);
});

const overlay = document.querySelector(".gradient-overlay");

function animateGradient(duration = 6000, maxOffset = 4000, direction = 1) {
  overlay.style.display = "block";
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const offset = -maxOffset + progress * (2 * maxOffset);
    const value = `${direction * offset}%`;
  
    overlay.style.setProperty("--cx", value);
    overlay.style.setProperty("--cy", value);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else {
      overlay.style.display = "none";
    }
  }

  requestAnimationFrame(step);
}