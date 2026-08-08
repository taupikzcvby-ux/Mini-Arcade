const dino = document.getElementById("dino");
const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const jumpButton = document.getElementById("jump-button");

let isJumping = false;
let gameOver = false;
let score = 0;
let gameSpeed = 6;
let cactusTimer;
let scoreTimer;

// ====================
// DINO LOMPAT
// ====================

function jump() {
    if (isJumping || gameOver) return;

    isJumping = true;

    let jumpHeight = 0;
    let goingUp = true;

    const jumpInterval = setInterval(() => {

        if (goingUp) {
            jumpHeight += 7;

            if (jumpHeight >= 130) {
                goingUp = false;
            }
        } else {
            jumpHeight -= 7;

            if (jumpHeight <= 0) {
                jumpHeight = 0;
                isJumping = false;
                clearInterval(jumpInterval);
            }
        }

        dino.style.bottom = (45 + jumpHeight) + "px";

    }, 20);
}

// ====================
// KONTROL
// ====================

document.addEventListener("keydown", function(event) {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {
        event.preventDefault();
        jump();
    }

});

jumpButton.addEventListener("touchstart", function(event) {
    event.preventDefault();
    jump();
});

jumpButton.addEventListener("click", function() {
    jump();
});

// ====================
// BUAT KAKTUS
// ====================

function createCactus() {

    if (gameOver) return;

    const cactus = document.createElement("div");

    cactus.innerHTML = "🌵";

    cactus.style.position = "absolute";
    cactus.style.bottom = "42px";
    cactus.style.right = "-50px";
    cactus.style.fontSize = "45px";
    cactus.style.zIndex = "4";

    game.appendChild(cactus);

    let cactusPosition = -50;

    const moveCactus = setInterval(() => {

        if (gameOver) {
            clearInterval(moveCactus);
            cactus.remove();
            return;
        }

        cactusPosition += gameSpeed;

        cactus.style.right = cactusPosition + "px";

        // Cek tabrakan
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        if (
            dinoRect.left < cactusRect.right - 10 &&
            dinoRect.right > cactusRect.left + 10 &&
            dinoRect.bottom > cactusRect.top + 10 &&
            dinoRect.top < cactusRect.bottom
        ) {
            endGame();
            clearInterval(moveCactus);
            return;
        }

        // Hapus kaktus jika sudah keluar layar
        if (cactusPosition > game.offsetWidth + 100) {
            clearInterval(moveCactus);
            cactus.remove();
        }

    }, 20);
}

// ====================
// SKOR
// ====================

function startScore() {

    scoreTimer = setInterval(() => {

        if (gameOver) return;

        score++;

        scoreText.textContent = score;

        // Game semakin cepat
        if (score % 100 === 0) {
            gameSpeed += 0.5;
        }

    }, 100);
}

// ====================
// SPAWN KAKTUS
// ====================

function startCactus() {

    createCactus();

    cactusTimer = setTimeout(() => {
        startCactus();
    }, randomCactusTime());
}

function randomCactusTime() {
    return Math.floor(Math.random() * 1200) + 900;
}

// ====================
// GAME OVER
// ====================

function endGame() {

    if (gameOver) return;

    gameOver = true;

    clearInterval(scoreTimer);
    clearTimeout(cactusTimer);

    finalScore.textContent = score;

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
// MULAI GAME
// ====================

startScore();
startCactus();
