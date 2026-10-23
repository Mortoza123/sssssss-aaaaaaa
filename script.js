// Starfield canvas: subtle animated background.
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let canvasW = 0;
let canvasH = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  canvas.width = canvasW * ratio;
  canvas.height = canvasH * ratio;
  canvas.style.width = `${canvasW}px`;
  canvas.style.height = `${canvasH}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(150, Math.floor(canvasW / 8)) }, () => ({
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    r: Math.random() * 1.4 + 0.25,
    alpha: Math.random() * 0.65 + 0.15,
    speed: Math.random() * 0.15 + 0.025,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(time = 0) {
  ctx.clearRect(0, 0, canvasW, canvasH);
  stars.forEach(star => {
    const twinkle = 0.6 + Math.sin(time * 0.001 + star.phase) * 0.35;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 230, 249, ${star.alpha * twinkle})`;
    ctx.fill();
    star.y -= star.speed;
    if (star.y < -3) { star.y = canvasH + 3; star.x = Math.random() * canvasW; }
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(drawStars);

// Build the 14-photo gallery.
const captions = [
  "A little moment ♡", "Just us", "A favourite memory", "The good old days",
  "That lovely smile", "Our kind of fun", "A day to remember", "Little things",
  "A happy memory", "My best friend", "A story in one photo", "Forever in the album",
  "One for the memories","Happy birthday, Sima ✦"
];
const grid = document.getElementById("photoGrid");
captions.forEach((caption, index) => {
  const n = index + 1;
  const figure = document.createElement("figure");
  figure.className = "photo-card";
  figure.style.setProperty("--tilt", `${[-1.8, 1.2, -0.8, 1.7, -1.1][index % 5]}deg`);
  figure.style.setProperty("--delay", `${index * 45}ms`);
  const img = document.createElement("img");
  img.src = `photos/photo${n}.jpeg`;
  img.alt = `Memory ${n} with Sima`;
  img.loading = "lazy";
  img.onerror = () => {
    img.onerror = null;
    img.src = `https://placehold.co/520x650/30203F/F4C7E0?text=Add+Photo+${n}`;
  };
  const cap = document.createElement("figcaption");
  cap.textContent = caption;
  figure.append(img, cap);
  grid.appendChild(figure);
});

// Scroll reveal effects.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal, .letter").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Gentle mouse glow on devices with a pointer.
const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", event => {
  if (event.pointerType === "mouse") {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = "1";
  }
});

// Birthday wish button: sparkles burst out around the button.
function sparkleBurst() {
  const button = document.getElementById("wishButton");
  const rect = button.getBoundingClientRect();
  const symbols = ["✦", "✧", "♡", "✶", "⋆"];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = `${rect.left + rect.width / 2}px`;
    p.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
    p.style.setProperty("--dx", `${(Math.random() - 0.5) * 360}px`);
    p.style.setProperty("--dy", `${(Math.random() - 0.5) * 300 - 40}px`);
    p.style.fontSize = `${12 + Math.random() * 18}px`;
    document.body.appendChild(p);
    window.setTimeout(() => p.remove(), 1800);
  }
}
document.getElementById("wishButton").addEventListener("click", () => {
  document.getElementById("wishResult").textContent =
    "Birthday wish sent into the universe: may your heart stay happy, Sima. ✨♡";
  sparkleBurst();
});


// Soft falling flower petals across the page.
function createFallingPetal() {
  const petal = document.createElement("span");
  petal.className = "petal-fall";
  petal.textContent = ["❀", "✿", "❁", "✾"][Math.floor(Math.random() * 4)];
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${12 + Math.random() * 19}px`;
  const duration = 9 + Math.random() * 8;
  petal.style.animationDuration = `${duration}s`;
  petal.style.setProperty("--sway", `${(Math.random() - 0.5) * 180}px`);
  document.body.appendChild(petal);
  window.setTimeout(() => petal.remove(), duration * 1000);
}
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
if (!reduceMotion) {
  const firstPetals = isSmallScreen ? 5 : 12;
  for (let i = 0; i < firstPetals; i++) {
    window.setTimeout(createFallingPetal, i * (isSmallScreen ? 950 : 550));
  }
  window.setInterval(createFallingPetal, isSmallScreen ? 2600 : 1200);
}
