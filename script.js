/* ============================================================
   Yilin Ouyang - personal page interactions
   ============================================================ */
"use strict";

/* ---- Year in the footer ---- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---- Dark / light theme (persisted) ---- */
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

/* ---- Mobile navigation ---- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

/* ---- Typing effect in the hero ---- */
const words = ["networking", "distributed systems", "Apache Spark", "machine learning", "web development"];
const typedEl = document.getElementById("typed");
let wordIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = words[wordIndex];
  charIndex += deleting ? -1 : 1;
  typedEl.textContent = word.slice(0, charIndex);
  let delay = deleting ? 55 : 110;
  if (!deleting && charIndex === word.length) { delay = 1400; deleting = true; }
  else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 300; }
  setTimeout(type, delay);
}
type();

/* ---- Scroll reveal ---- */
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ---- Animated "network" background ---- */
const canvas = document.getElementById("net-canvas");
const ctx = canvas.getContext("2d");
let nodes = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 26000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.8 + 0.8,
  }));
}
window.addEventListener("resize", resize);
resize();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = root.getAttribute("data-theme") === "dark" ? "96,165,250" : "37,99,235";

  for (const n of nodes) {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color},0.7)`;
    ctx.fill();
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${color},${0.18 * (1 - dist / 130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();
