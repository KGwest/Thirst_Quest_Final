console.log("🎮 script.js loaded");
let gameRunning = false;

// DOM elements
const gameArea = document.getElementById("game-area");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const waterLevel = document.getElementById("water-level");
const scoreDisplay = document.getElementById("score");
const diffRadios = document.querySelectorAll('input[name="difficulty"]');

// Preload sounds
const startSound = new Audio("assets/sounds/start.mp3");
const cleanSound = new Audio("assets/sounds/clean.mp3");
const dirtySound = new Audio("assets/sounds/dirty.mp3");
const victorySound = new Audio("assets/sounds/victory.mp3");
const failSound = new Audio("assets/sounds/fail.mp3");

const sounds = {
  start: startSound,
  clean: cleanSound,
  dirty: dirtySound,
  victory: victorySound,
  fail: failSound,
};

Object.values(sounds).forEach((a) => a.load());

// 4) Game state
let timeLeft, fillLevel, gameInterval, dropInterval, gameEnded, score;

// 5) Highlight the selected difficulty card
function syncDifficultyUI() {
  diffRadios.forEach((radio) => {
    const card = radio.closest(".diff-card");
    card.classList.toggle("active", radio.checked);
  });
}

// 6) difficulty headers
diffRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (gameRunning) return; // ⛔ Prevent changes mid-game
    console.log("🛠 Difficulty:", radio.value);
    syncDifficultyUI();
  });
});

// 7) Kick off the game
function startGame() {
  console.log("▶️ startGame fired");
  startSound.currentTime = 0;
  // Play music only if not already running
  if (sounds.start.paused || sounds.start.ended) {
    sounds.start.volume = 1;
    sounds.start.play().catch((err) => {
      console.warn("⚠️ Could not play start sound:", err);
    });
  }

  gameRunning = true;
  diffRadios.forEach((radio) => {
    radio.disabled = true;
  });

  const picked = document.querySelector('input[name="difficulty"]:checked');
  if (!picked) {
    console.warn("⚠️ please pick a difficulty first");
    return;
  }

  // set difficulty parameters
  let spawnIntervalMs, badDropChance;
  switch (picked.value) {
    case "easy":
      spawnIntervalMs = 300;
      badDropChance = 0.08;
      break;
    case "normal":
      spawnIntervalMs = 800;
      badDropChance = 0.2;
      break;
    case "hard":
      spawnIntervalMs = 400;
      badDropChance = 0.625;
      break;
    default:
      spawnIntervalMs = 800;
      badDropChance = 0.3;
  }
  console.log({ spawnIntervalMs, badDropChance });

  // reset state
  score = 0;
  timeLeft = 30;
  fillLevel = 0;
  gameEnded = false;
  scoreDisplay.innerText = `Score: 0`;
  timerDisplay.innerText = `Time: 30`;
  updateWaterLevel();
  gameArea.innerHTML = "";

  clearInterval(gameInterval);
  clearInterval(dropInterval);

  gameInterval = setInterval(updateTimer, 1000);
  dropInterval = setInterval(() => spawnDrop(badDropChance), spawnIntervalMs);
}

// 8) Countdown
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerDisplay.innerText = `Time: ${timeLeft}`;
  } else {
    endGame(false);
  }
}

// 9) Spawn one drop
function spawnDrop(badDropChance) {
  if (gameEnded) return;
  const drop = document.createElement("div");
  drop.className = "drop";

  const isClean = Math.random() > badDropChance;
  drop.innerText = isClean ? "💧" : "🧪";
  drop.classList.add(isClean ? "clean-drop" : "bad-drop");
  drop.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;

  function handleDrop(e) {
    e.preventDefault();
    if (gameEnded) return;

    if (isClean) {
      sounds.clean.currentTime = 0;
      sounds.clean.play().catch(() => {});
      // scoring logic...
    } else {
      sounds.dirty.currentTime = 0;
      sounds.dirty.play().catch(() => {});
      // penalty logic...
    }

    if (isClean) {
      score++;
      fillLevel = Math.min(100, fillLevel + 5);
      scoreDisplay.innerText = `Score: ${score}`;
      updateWaterLevel();
      if (fillLevel === 100) return endGame(true);
    } else {
      score = Math.max(0, score - 1);
      fillLevel = Math.max(0, fillLevel - 2.5);
      scoreDisplay.innerText = `Score: ${score}`;
      updateWaterLevel();
      drop.classList.add("penalty");
      setTimeout(() => drop.classList.remove("penalty"), 200);
    }
    drop.remove();
  }

  drop.addEventListener("click", handleDrop);
  drop.addEventListener("touchstart", handleDrop, { passive: true });
  gameArea.appendChild(drop);
  setTimeout(() => drop.remove(), 3000);
}

// 10) Bucket fill
function updateWaterLevel() {
  waterLevel.style.height = `${fillLevel}%`;
}

function fadeOutSound(sound, duration = 1000) {
  const steps = 20;
  const stepTime = duration / steps;
  const step = sound.volume / steps;

  let fadeInterval = setInterval(() => {
    if (sound.volume > step) {
      sound.volume -= step;
    } else {
      sound.volume = 1;
      sound.pause();
      sound.currentTime = 0;
      clearInterval(fadeInterval);
      sound.volume = 1; // Reset volume after fade
    }
  }, stepTime);
}

// 11) End‐game overlay
function endGame(won) {
  if (gameEnded) return;
  gameEnded = true;
  gameRunning = false;
  diffRadios.forEach((radio) => {
    radio.disabled = false;
  });
  clearInterval(gameInterval);
  clearInterval(dropInterval);

  const overlay = document.getElementById("overlay");
  const title = document.getElementById("overlay-title");
  const text = document.getElementById("overlay-text");
  const link = document.getElementById("overlay-link");
  fadeOutSound(sounds.start);

  setTimeout(() => {
  sounds.start.pause();
  sounds.start.currentTime = 0;
}, 1200); // allow fadeOutSound to complete

  if (won) {
    waterLevel.style.transition = "height 1s ease";
    waterLevel.style.height = "100%";
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    title.innerText = "🎉 You filled the bucket!";
    text.innerText = "Your taps power real clean-water projects.";
    sounds.victory.currentTime = 0;
    sounds.victory.play().catch(() => {});
  } else {
    title.innerText = "⏳ Time’s up!";
    text.innerText = "Try again and help turn the tide.";
    sounds.fail.currentTime = 0;
    sounds.fail.play().catch(() => {});
  }
  link.href = "https://www.charitywater.org/donate";
  overlay.classList.remove("hidden");
}

// 12) Close overlay
function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

// 13) Sound hook up for Buttons
startBtn.addEventListener("click", () => {
  if (gameRunning) return; // ✅ Prevent double starts

  const picked = document.querySelector('input[name="difficulty"]:checked');
  if (!picked) {
    alert("Please select a difficulty before starting!");
    return;
  }

  startGame();
});

resetBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  clearInterval(dropInterval);
  fadeOutSound(sounds.start); // <- this was missing
  startGame();
});
