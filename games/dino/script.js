const dinoWrap = document.getElementById("dino");
const dinoInner = dinoWrap.querySelector(".dino-inner");
const game = document.getElementById("game");
const ground = document.getElementById("ground");
const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("best-score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const newBestText = document.getElementById("new-best");
const jumpButton = document.getElementById("jump-button");

const GROUND_Y = 0;        // translateY baseline (dino sits at CSS "bottom: 45px")
const GRAVITY = 2600;      // px / s^2
const JUMP_VELOCITY = -820; // px / s (negative = upward)
const BASE_GAME_SPEED = 260; // px / s horizontal cactus speed
const BASE_LEG_DURATION = 0.26; // s per running step at base speed

let velocityY = 0;
let posY = GROUND_Y;
let isJumping = false;
let gameOver = false;
let score = 0;
let scoreAccumulator = 0;
let gameSpeed = BASE_GAME_SPEED;
let lastSpeedStep = 0;
let lastTime = null;
let cactusSpawnTimer = randomCactusTime();
let cactuses = [];
let rafId = null;

const BEST_KEY = "mini-arcade-dino-best";
let bestScore = Number(localStorage.getItem(BEST_KEY)) || 0;
bestScoreText.textContent = bestScore;

dinoInner.classList.add("running");

// ====================
// JUMP
// ====================

function jump() {
    if (isJumping || gameOver) return;

    isJumping = true;
    velocityY = JUMP_VELOCITY;

    dinoInner.classList.add("jumping");
    dinoInner.classList.remove("running");
}

function land() {
    isJumping = false;
    posY = GROUND_Y;
    velocityY = 0;

    dinoInner.classList.remove("jumping");
    dinoInner.classList.add("running");

    dinoInner.classList.remove("landing");
    // restart squash animation
    void dinoInner.offsetWidth;
    dinoInner.classList.add("landing");
}

// ====================
// KONTROL
// ====================

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
    }
});

jumpButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    jump();
});

jumpButton.addEventListener("click", function () {
    jump();
});

// ====================
// CACTUS
// ====================

const CACTUS_TYPES = [
    { w: 14, h: 26, arms: 0 },
    { w: 16, h: 38, arms: 1 },
    { w: 18, h: 44, arms: 2 },
    { w: 12, h: 20, arms: 0 }
];

function createCactus() {
    if (gameOver) return;

    const type = CACTUS_TYPES[Math.floor(Math.random() * CACTUS_TYPES.length)];

    const el = document.createElement("div");
    el.className = "cactus";
    el.style.width = type.w + "px";
    el.style.height = type.h + "px";

    const body = document.createElement("div");
    body.className = "cactus-body";
    body.style.width = type.w + "px";
    body.style.height = type.h + "px";
    el.appendChild(body);

    if (type.arms >= 1) {
        const armR = document.createElement("div");
        armR.className = "cactus-arm";
        armR.style.width = "6px";
        armR.style.height = Math.round(type.h * 0.4) + "px";
        armR.style.right = "-4px";
        armR.style.top = Math.round(type.h * 0.25) + "px";
        armR.style.transform = "rotate(18deg)";
        el.appendChild(armR);
    }

    if (type.arms >= 2) {
        const armL = document.createElement("div");
        armL.className = "cactus-arm";
        armL.style.width = "6px";
        armL.style.height = Math.round(type.h * 0.35) + "px";
        armL.style.left = "-4px";
        armL.style.top = Math.round(type.h * 0.4) + "px";
        armL.style.transform = "rotate(-18deg)";
        el.appendChild(armL);
    }

    game.appendChild(el);

    const gameWidth = game.offsetWidth;

    cactuses.push({
        el: el,
        x: gameWidth + 20,
        width: type.w
    });

    el.style.right = "auto";
    el.style.left = (cactuses[cactuses.length - 1].x) + "px";
}

function randomCactusTime() {
    return (Math.random() * 1.2 + 0.9); // seconds
}

// ====================
// GAME LOOP
// ====================

function updateSpeedRelatedTiming() {
    const speedRatio = gameSpeed / BASE_GAME_SPEED;

    ground.style.setProperty(
        "--ground-duration",
        (0.6 / speedRatio) + "s"
    );

    dinoInner.style.setProperty(
        "--leg-duration",
        (BASE_LEG_DURATION / speedRatio) + "s"
    );
}

function loop(timestamp) {
    if (gameOver) return;

    if (lastTime === null) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // clamp dt to avoid huge jumps (tab switching etc.)
    if (dt > 0.05) dt = 0.05;

    // --- jump physics ---
    if (isJumping) {
        velocityY += GRAVITY * dt;
        posY += velocityY * dt;

        if (posY >= GROUND_Y) {
            land();
        } else {
            dinoWrap.style.transform = "translateY(" + posY + "px)";
        }
    }

    if (!isJumping) {
        dinoWrap.style.transform = "translateY(0px)";
    }

    // --- cactus spawn ---
    cactusSpawnTimer -= dt;
    if (cactusSpawnTimer <= 0) {
        createCactus();
        cactusSpawnTimer = randomCactusTime();
    }

    // --- cactus movement + collision ---
    const dinoRect = dinoWrap.getBoundingClientRect();

    for (let i = cactuses.length - 1; i >= 0; i--) {
        const c = cactuses[i];
        c.x -= gameSpeed * dt;
        c.el.style.left = c.x + "px";

        const cactusRect = c.el.getBoundingClientRect();

        if (
            dinoRect.left < cactusRect.right - 10 &&
            dinoRect.right > cactusRect.left + 10 &&
            dinoRect.bottom > cactusRect.top + 8 &&
            dinoRect.top < cactusRect.bottom
        ) {
            endGame();
            return;
        }

        if (c.x < -60) {
            c.el.remove();
            cactuses.splice(i, 1);
        }
    }

    // --- score ---
    scoreAccumulator += dt;
    while (scoreAccumulator >= 0.1) {
        score++;
        scoreAccumulator -= 0.1;
        scoreText.textContent = score;

        if (score - lastSpeedStep >= 100) {
            lastSpeedStep = score;
            gameSpeed += 22;
            updateSpeedRelatedTiming();
        }
    }

    rafId = requestAnimationFrame(loop);
}

// ====================
// GAME OVER
// ====================

function endGame() {
    if (gameOver) return;

    gameOver = true;
    if (rafId) cancelAnimationFrame(rafId);

    dinoInner.classList.remove("running", "jumping");

    finalScore.textContent = score;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem(BEST_KEY, String(bestScore));
        newBestText.style.display = "block";
    } else {
        newBestText.style.display = "none";
    }

    bestScoreText.textContent = bestScore;

    gameOverScreen.style.display = "flex";
}

// ====================
// RESTART
// ====================

function restartGame() {
    location.reload();
}

// ====================
// KEMBALI KE MENU
// ====================

function goBack() {
    window.location.href = "../../index.html";
}

// ====================
// PAUSE ON HIDDEN TAB
// ====================

document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        lastTime = null;
    }
});

// ====================
// MULAI GAME
// ====================

updateSpeedRelatedTiming();
rafId = requestAnimationFrame(loop);
