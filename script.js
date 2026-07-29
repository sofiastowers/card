/* ============================================================
   CONFIG — the only section you need to edit to personalize
   ============================================================ */
const CONFIG = {
  recipientName: "CPA",          // e.g. "Jess" -> "future Jess!" ... leave "CPA" for the generic version
  examLabel: "the exam",          // e.g. "FAR", "REG", "AUD", "the exam"
  heroMessage:
    "Every late night studying, every practice question, every re-read of a " +
    "standard you didn't want to look at again — it all led here. Walk in " +
    "knowing you've already done the hard part.",
  fortunes: [
    "You don't need to know everything. You just need to know enough, and you do.",
    "Nerves mean you care. Let them sit next to you, not drive.",
    "You've passed harder days than this one already.",
    "Flag it, breathe, move on. You can come back to it.",
    "The exam ends. Your knowledge doesn't.",
    "You are not behind. You are exactly where your work brought you.",
    "One question does not decide the whole exam. Keep going.",
    "You studied the hard way. That's the way that sticks.",
  ],
  seedMessages: [
    { name: "a friend", text: "You are going to walk out of there so relieved. Rooting for you!" },
    { name: "a friend", text: "Remember to breathe between sections. You've got the knowledge already." },
    { name: "a friend", text: "Future-you is already so proud of present-you for showing up." },
  ],
};

/* ============================================================
   pixel-art engine (tiny canvas, drawn pixel-by-pixel, then
   scaled up crisp via CSS image-rendering: pixelated)
   ============================================================ */
const PALETTE = {
  dark:  "#3F5C3A",
  mid:   "#6B8E5A",
  light: "#B9D1A0",
  stem:  "#4A6741",
  eye:   "#4A4136",
  blush: "#E8A3AE",
};

function fillCirclePx(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  const minX = Math.floor(cx - r), maxX = Math.ceil(cx + r);
  const minY = Math.floor(cy - r), maxY = Math.ceil(cy + r);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx + 0.5, dy = y - cy + 0.5;
      if (dx * dx + dy * dy <= r * r) ctx.fillRect(x, y, 1, 1);
    }
  }
}

/** Draws a small pixel four-leaf clover onto a canvas's 2d context. */
function drawClover(ctx, size, { face = false, palette = PALETTE } = {}) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2 - size * 0.04;
  const r = size * 0.22;
  const off = size * 0.21;

  // stem
  ctx.fillStyle = palette.stem;
  ctx.fillRect(Math.round(cx - size * 0.035), Math.round(cy + r * 0.6), Math.round(size * 0.07), Math.round(size * 0.34));

  const lobes = [
    { dx: 0, dy: -off },
    { dx: 0, dy: off },
    { dx: -off, dy: 0 },
    { dx: off, dy: 0 },
  ];

  lobes.forEach((l) => fillCirclePx(ctx, cx + l.dx, cy + l.dy, r + 1, palette.dark));
  lobes.forEach((l) => fillCirclePx(ctx, cx + l.dx, cy + l.dy, r, palette.mid));
  lobes.forEach((l) =>
    fillCirclePx(ctx, cx + l.dx - r * 0.32, cy + l.dy - r * 0.32, r * 0.4, palette.light)
  );

  if (face) {
    const topDy = -off;
    const eyeY = cy + topDy - size * 0.01;
    ctx.fillStyle = palette.eye;
    ctx.fillRect(Math.round(cx - size * 0.075), Math.round(eyeY), 2, 2);
    ctx.fillRect(Math.round(cx + size * 0.03), Math.round(eyeY), 2, 2);
    ctx.fillStyle = palette.blush;
    ctx.fillRect(Math.round(cx - size * 0.16), Math.round(eyeY + size * 0.045), 2, 2);
    ctx.fillRect(Math.round(cx + size * 0.1), Math.round(eyeY + size * 0.045), 2, 2);
  }
}

/** Returns a small canvas rendered as a data URL, for reuse as <img> / background-image. */
function cloverDataURL(size, opts) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  drawClover(c.getContext("2d"), size, opts);
  return c.toDataURL();
}

const CLOVER_VARIANTS = [
  { dark: "#3F5C3A", mid: "#6B8E5A", light: "#C9DCB8", stem: "#4A6741" },
  { dark: "#3F5C3A", mid: "#88A96D", light: "#D9E6C9", stem: "#4A6741" },
  { dark: "#3F5C3A", mid: "#7DA37A", light: "#E3EBD1", stem: "#4A6741" },
];

/* ============================================================
   boot: mascot, borders, ambient sparkles
   ============================================================ */
function initMascot() {
  const canvas = document.getElementById("mascot-canvas");
  drawClover(canvas.getContext("2d"), canvas.width, { face: true });
  // no separate click handler here on purpose — clicks bubble up to #cover,
  // which opens the card and bursts sparkles from the mascot's position.
}

function initBorders() {
  const tileSmall = cloverDataURL(24);
  const tileBig = cloverDataURL(32);
  document.querySelectorAll(".cover-border").forEach((el) => {
    el.style.backgroundImage = `url(${tileSmall})`;
  });
  document.querySelectorAll(".garland").forEach((el) => {
    el.style.backgroundImage = `url(${tileBig})`;
  });
}

function initAmbientSparkles() {
  const layer = document.getElementById("sparkle-layer");
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle" + (Math.random() > 0.6 ? " pink" : "");
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDuration = 3 + Math.random() * 4 + "s";
    s.style.animationDelay = Math.random() * 5 + "s";
    layer.appendChild(s);
  }
}

function burstSparkles(rect) {
  const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const colors = ["#E3B23C", "#E8A3AE", "#6B8E5A"];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement("div");
    el.className = "burst-sparkle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 90;
    el.style.left = originX + "px";
    el.style.top = originY + "px";
    el.style.color = colors[i % colors.length];
    el.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    el.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* ============================================================
   cover -> card transition
   ============================================================ */
function openCard() {
  const cover = document.getElementById("cover");
  const card = document.getElementById("card");
  if (cover.classList.contains("opening")) return;

  burstSparkles(document.getElementById("mascot-canvas").getBoundingClientRect());
  cover.classList.add("opening");

  setTimeout(() => {
    cover.hidden = true;
    card.hidden = false;
    card.querySelector(".pixel-btn") && null;
    window.scrollTo(0, 0);
  }, 480);
}

function initCover() {
  const cover = document.getElementById("cover");
  cover.addEventListener("click", openCard);
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCard();
    }
  });
}

/* ============================================================
   hero personalization
   ============================================================ */
function initHero() {
  document.getElementById("recipient-name").textContent = CONFIG.recipientName;
  document.getElementById("hero-sub").textContent = CONFIG.heroMessage;
  document.getElementById("bell-btn").addEventListener("click", (e) => {
    burstSparkles(e.target.getBoundingClientRect());
  });
}

/* ============================================================
   fortune notes
   ============================================================ */
function initFortunes() {
  const textEl = document.getElementById("fortune-text");
  const nextBtn = document.getElementById("fortune-next");
  let last = -1;

  function showRandom() {
    let idx;
    do {
      idx = Math.floor(Math.random() * CONFIG.fortunes.length);
    } while (idx === last && CONFIG.fortunes.length > 1);
    last = idx;
    textEl.style.opacity = 0;
    setTimeout(() => {
      textEl.textContent = CONFIG.fortunes[idx];
      textEl.style.opacity = 1;
    }, 180);
  }

  nextBtn.addEventListener("click", showRandom);
  showRandom();
}

/* ============================================================
   luck garden (localStorage-backed guestbook)
   ============================================================ */
const STORAGE_KEY = "cpa-luck-garden-messages";

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Couldn't read saved messages:", e);
  }
  return CONFIG.seedMessages.slice();
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn("Couldn't save messages:", e);
  }
}

let messages = [];

function renderGarden(highlightLast = false) {
  const grid = document.getElementById("garden-grid");
  grid.innerHTML = "";
  messages.forEach((msg, i) => {
    const btn = document.createElement("button");
    btn.className = "clover-item";
    if (highlightLast && i === messages.length - 1) btn.classList.add("new-clover");
    btn.title = `${msg.name}: ${msg.text}`;

    const img = document.createElement("img");
    img.src = cloverDataURL(28, CLOVER_VARIANTS[i % CLOVER_VARIANTS.length]);
    img.alt = "";

    const label = document.createElement("span");
    label.textContent = msg.name;

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener("click", () => openPopover(msg));
    grid.appendChild(btn);
  });
}

function openPopover(msg) {
  const pop = document.getElementById("popover");
  pop.querySelector(".popover-name").textContent = `from ${msg.name}`;
  pop.querySelector(".popover-text").textContent = msg.text;
  pop.hidden = false;
}

function initPopover() {
  const pop = document.getElementById("popover");
  document.getElementById("popover-close").addEventListener("click", () => (pop.hidden = true));
  pop.addEventListener("click", (e) => {
    if (e.target === pop) pop.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pop.hidden) pop.hidden = true;
  });
}

function initGarden() {
  messages = loadMessages();
  renderGarden();

  const form = document.getElementById("message-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("msg-name");
    const textInput = document.getElementById("msg-text");
    const name = nameInput.value.trim() || "a friend";
    const text = textInput.value.trim();
    if (!text) return;

    messages.push({ name, text, ts: Date.now() });
    saveMessages(messages);
    renderGarden(true);
    burstSparkles(form.getBoundingClientRect());

    form.reset();
    document.getElementById("garden-grid").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ============================================================
   boot
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initMascot();
  initBorders();
  initAmbientSparkles();
  initCover();
  initHero();
  initFortunes();
  initGarden();
  initPopover();
});
