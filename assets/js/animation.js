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
  if (!el) return; // Exit if element is not found

  const text = el.innerHTML;
  let count = 0;
  el.innerHTML = text.replace(/(<[^>]+>|\S+|\s+)/g, (match) => {
    if (match.startsWith("<")) return match;
    if (match.trim() === "") return match;
    return `<span class="${className}" style="top: ${count * 2}em; --i: ${
      count++ * Math.floor(Math.random() * text.length)
    }">${match}</span>`;
  });
}

animate("#main-text", "letter");
animateW(".main-info", "random");
animate(".moveAnimation", "moveAnimation");
animateR("#social", "fadeIn");

// creating svg function call
window.createSVGFrame = function (show = false) {
  let svgElement = document.querySelector("#svg-frame");

  if (show && !svgElement) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "svg-frame");
    // svg.style.position = "fixed";
    svg.style.top = 0;
    svg.style.left = 0;
    svg.style.zIndex = 9999;
    svg.style.display = "block";

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "black");

    svg.appendChild(rect);
    document.body.appendChild(svg);

    const updateSVGSize = () => {
      svg.setAttribute("width", window.innerWidth);
      svg.setAttribute("height", window.innerHeight);
    };

    updateSVGSize();
    window.addEventListener("resize", updateSVGSize);
  } else if (!show && svgElement) {
    document.body.removeChild(svgElement);
    window.removeEventListener("resize", updateSVGSize);
  }
};

function toggleCSSRule(shouldAdd = true) {
    const styleId = 'dynamic-style';
    const styleContent = `
      body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: red;
        mask: url("#svg-frame") no-repeat center center / contain no-repeat, linear-gradient(#000 0 0);
        mask-composite: exclude;
        mask-size: 10em;
      }
    `;
  
    // Check if the style element already exists
    let styleElement = document.getElementById(styleId);
  
    if (shouldAdd) {
      // If the style element doesn't exist, create it
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      // Set the style content
      styleElement.innerHTML = styleContent;
    } else {
      // If the style element exists, remove it
      if (styleElement) {
        styleElement.remove();
      }
    }
  }
  
  // Example usage:
  // Add the CSS rule

// Usage
createSVGFrame(false); // To show the SVG
// createSVGFrame(false); // To hide the SVG (uncomment to test)
setTimeout(() => {
    // toggleCSSRule(); // Defaults to true
}, 3000)
