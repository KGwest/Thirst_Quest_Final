// Grab DOM elements up front
const gameArea     = document.getElementById("game-area");
const timerDisplay = document.getElementById("timer");
const startBtn     = document.getElementById("start-btn");
const resetBtn     = document.getElementById("reset-btn");
const waterLevel   = document.getElementById("water-level");
const scoreDisplay = document.getElementById("score");
const diffRadios   = document.querySelectorAll('input[name="difficulty"]');
const sounds = {
  tap:    new Audio('/assets/sounds/drop-tap.mp3'),
  fail:   new Audio('/assets/sounds/fail-sting.mp3'),
  victory: new Audio('/assets/sounds/cheer.mp3'),
};

Object.values(sounds).forEach(a => a.load());



let timeLeft, fillLevel, gameInterval, dropInterval, gameEnded, score;

// Sync UI highlight on the difficulty cards
function syncDifficultyUI() {
  diffRadios.forEach(radio => {
    const card = radio.closest(".diff-card");
    card.classList.toggle("active", radio.checked);
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  startBtn.disabled = true;
  diffRadios.forEach(r => r.checked = false);
  syncDifficultyUI();
});

// When they choose a difficulty: highlight + shake Start
diffRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    syncDifficultyUI();
    startBtn.disabled = false;
    startBtn.classList.add("shake");
    setTimeout(() => startBtn.classList.remove("shake"), 500);
  });
});

// Start the game
function startGame() {
  const picked = document.querySelector('input[name="difficulty"]:checked');
  if (!picked) return;

  // Difficulty settings
  let spawnIntervalMs, badDropChance;
  switch (picked.value) {
    case "easy":
      spawnIntervalMs = 300;     // drops every 0.3s
      badDropChance   = 0.08;    // now 92% clean drops
      break;

    case "normal":
      spawnIntervalMs = 800;    // drops every 0.8s
      badDropChance   = 0.33;   // ~33% polluted to mirror 1 in 3 without safe water
      break;
    case "hard":
      spawnIntervalMs = 400;   // drops every 0.4s
      badDropChance   = 0.625;  // 62.5% polluted
      break;
  }

  // Reset
  score      = 0;
  timeLeft   = 30;
  fillLevel  = 0;
  gameEnded  = false;
  scoreDisplay.innerText = `Score: ${score}`;
  timerDisplay.innerText = `Time: ${timeLeft}`;
  updateWaterLevel();
  gameArea.innerHTML = "";

  clearInterval(gameInterval);
  clearInterval(dropInterval);

  gameInterval = setInterval(updateTimer,        1000);
  dropInterval = setInterval(() => spawnDrop(badDropChance), spawnIntervalMs);
}

// Countdown
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerDisplay.innerText = `Time: ${timeLeft}`;
  } else {
    endGame(false);
  }
}

// Spawn a single drop
function spawnDrop(badDropChance) {
  if (gameEnded) return;

  const drop    = document.createElement("div");
  drop.className = "drop";

  const isClean = Math.random() > badDropChance;
  drop.innerText = isClean ? "💧" : "🧪";
  drop.classList.add(isClean ? "clean-drop" : "bad-drop");
  drop.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;

  function handleDrop(e) {
    e.preventDefault();
    if (gameEnded) return;

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

  drop.addEventListener("click",      handleDrop);
  drop.addEventListener("touchstart", handleDrop, { passive: true });

  gameArea.appendChild(drop);
  setTimeout(() => drop.remove(), 3000);
}

// Animate bucket
function updateWaterLevel() {
  waterLevel.style.height = `${fillLevel}%`;
}

// End-of-game overlay
function endGame(won) {
  if (gameEnded) return;
  gameEnded = true;
  clearInterval(gameInterval);
  clearInterval(dropInterval);

  const overlay = document.getElementById("overlay");
  const title   = document.getElementById("overlay-title");
  const text    = document.getElementById("overlay-text");
  const link    = document.getElementById("overlay-link");

  if (won) {
    waterLevel.style.transition = "height 1s ease";
    waterLevel.style.height     = "100%";
    confetti({ particleCount:150, spread:70, origin:{ y:0.6 } });
    title.innerText = "🎉 You filled the bucket!";
    text.innerText  = "Your taps power real clean-water projects.";
    link.href       = "https://www.charitywater.org/donate";
    sounds.victory.currentTime = 0;
    sounds.victory.play();
  } else {
    title.innerText = "⏳ Time’s up!";
    text.innerText  = "Try again and help turn the tide.";
    link.href       = "https://www.charitywater.org/donate";
    sounds.fail.currentTime = 0;
    sounds.fail.play();
  }

  overlay.classList.remove("hidden");
}

// Close overlay
function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

// Button hookups
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  clearInterval(dropInterval);
  startGame();
});
