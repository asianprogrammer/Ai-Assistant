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
let AI_SOUND = new Audio();
AI_SOUND.src = "./assets/sounds/ai.mp3";

AI_BUTTTON.addEventListener("click", () => {
  createSVGFrame(true);
  controlGradient(true);

  // EFFECT.classList.add("on");
  // let time = setTimeout(() => {
  //   EFFECT.classList.remove("on");
  //   clearTimeout(time);
  // }, 2000);

  if (window.innerWidth < 700) {
    animateGradient(900, 900, -1);
    let x = setTimeout(() => {
      AI_SOUND.play();
      clearTimeout(x);
    }, 100);
  } else {
    animateGradient(2000, 2000);
    let x = setTimeout(() => {
      AI_SOUND.play();
      clearTimeout(x);
    }, 1000);
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

const isLowEndDevice = (() => {
  const ua = navigator.userAgent;
  const lowUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return lowUa.test(ua) && (screen.width < 768 || navigator.deviceMemory < 2);
})();
let _cachedFps = 60;
(function(probes = 10) {
  let count = 0, startTs = 0, lastTs = 0, total = 0;
  function step(ts) {
    if (!startTs) startTs = lastTs = ts;
    else { total += ts - lastTs; lastTs = ts; count++; }
    if (count < probes) requestAnimationFrame(step);
    else _cachedFps = Math.round(1000 / (total / count));
  }
  requestAnimationFrame(step);
})();

function FPS() { return _cachedFps; }

function animateGradient(d = 5000, m = 4000, dir = 1) {
  const fps = isLowEndDevice ? Math.min(FPS(), 30) : FPS();
  const interval = 1000 / fps;
  overlay.style.display = "block";
  let start = 0, last = 0, id;
  function step(ts) {
    if (!start) start = ts;
    const e = ts - start, Δ = ts - last;
    if (Δ >= interval || e >= d) {
      last = ts;
      const t = e >= d ? 1 : e / d;
      const v = dir * (-m + 2 * m * t) + "%";
      overlay.style.setProperty("--cx", v);
      overlay.style.setProperty("--cy", v);
      if (t === 1) { overlay.style.display = "none"; return; }
    }
    id = requestAnimationFrame(step);
  }
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}