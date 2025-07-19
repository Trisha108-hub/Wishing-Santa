const wishInput = document.getElementById("wishInput");
const submitWish = document.getElementById("submitWish");
const wishlistItems = document.getElementById("wishlistItems");
const wishlistPanel = document.getElementById("wishlistPanel");
const resetBtn = document.getElementById("resetBtn");
const grantBtn = document.getElementById("grantWishBtn");
const giftBox = document.getElementById("giftBox");
const motivationMessage = document.getElementById("motivationMessage");
const guidanceText = document.getElementById("guidanceText");
const calendar = document.getElementById("calendar");
const unwrapChime = document.getElementById("unwrapChime");

const MAX_WISHES = 3;
const motivations = [
  "🌟 Believe in yourself, magic is real!",
  "🎯 Dreams become reality when you act!",
  "💖 You're stronger than you think!",
  "🚀 The sky isn't the limit—it's just the beginning!",
  "🌈 Shine bright. Even stars need darkness to sparkle.",
  "🎄 Santa believes in you—and so should you!",
  "🌻 Every day is a chance to grow!",
];

function getToday() {
  return new Date().toLocaleDateString();
}

function loadWishes() {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || {};
  const today = getToday();
  const todayWishes = wishes[today] || [];

  wishlistItems.innerHTML = "";

  todayWishes.forEach((wishObj, index) => {
    const li = document.createElement("li");
    li.classList.add("wish-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = wishObj.granted;
    checkbox.addEventListener("change", () => toggleWishGranted(index));

    const span = document.createElement("span");
    span.textContent = wishObj.text;
    span.classList.add("wish-text");
    if (wishObj.granted) span.classList.add("granted");

    li.appendChild(checkbox);
    li.appendChild(span);
    wishlistItems.appendChild(li);
  });

  wishlistPanel.classList.toggle("hidden", todayWishes.length === 0);
  resetBtn.classList.toggle("hidden", todayWishes.length === 0);

  return todayWishes;
}

function toggleWishGranted(index) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || {};
  const today = getToday();
  if (!wishes[today] || !wishes[today][index]) return;

  wishes[today][index].granted = !wishes[today][index].granted;
  localStorage.setItem("wishes", JSON.stringify(wishes));
  loadWishes();
  updateCalendar();
}

function saveWish(wish) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || {};
  const today = getToday();
  if (!wishes[today]) wishes[today] = [];
  wishes[today].push({ text: wish, granted: false });
  localStorage.setItem("wishes", JSON.stringify(wishes));
}

function updateCalendar() {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || {};
  calendar.innerHTML = "";

  const today = new Date();
  const currentMonth = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = 31;

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, currentMonth, i).toLocaleDateString();
    const day = document.createElement("div");
    day.classList.add("calendar-day");
    if (wishes[date]?.length > 0) {
      day.classList.add("fulfilled");
    }
    day.innerText = i;
    calendar.appendChild(day);
  }
}

submitWish.addEventListener("click", () => {
  const wish = wishInput.value.trim();
  if (wish === "") return;

  const todayWishes = loadWishes();
  if (todayWishes.length >= MAX_WISHES) {
    guidanceText.textContent = "🛑 Only 3 wishes allowed per day!";
    return;
  }

  saveWish(wish);
  wishInput.value = "";
  guidanceText.textContent = "✨ Wish added!";
  loadWishes();
  updateCalendar();
});

grantBtn.addEventListener("click", () => {
  const todayWishes = loadWishes();
  if (todayWishes.length === 0) {
    guidanceText.textContent = "📭 You haven’t made any wishes today!";
    return;
  }

  unwrapChime.currentTime = 0;
  unwrapChime.play();

  giftBox.classList.add("open");

  setTimeout(() => {
    const message = motivations[Math.floor(Math.random() * motivations.length)];
    motivationMessage.textContent = message;
    motivationMessage.classList.remove("hidden");
  }, 1000);
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("wishes");
  localStorage.removeItem("lastWishDate");
  window.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  loadWishes();
  updateCalendar();
  createSnowflakesOnCanvas();
});

function createSnowflakesOnCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "snowCanvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const snowflakes = Array.from({ length: 100 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    d: Math.random() + 0.5,
  }));

  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();

    snowflakes.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
    });

    ctx.fill();
    moveSnowflakes();
  }

  function moveSnowflakes() {
    snowflakes.forEach((flake) => {
      flake.y += flake.d;
      if (flake.y > canvas.height) {
        flake.y = 0;
        flake.x = Math.random() * canvas.width;
      }
    });
  }

  setInterval(drawSnowflakes, 33);

  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 9999;
}

