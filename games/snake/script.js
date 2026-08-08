const board = document.getElementById("game-board");
const snakeElement = document.getElementById("snake");
const foodElement = document.getElementById("food");

const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

const gridSize = 20;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let food = {
    x: 15,
    y: 10
};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let gameOver = false;

let gameLoop;


// ============================
// GAMBAR SNAKE
// ============================

function drawSnake() {

    // Hapus bagian snake lama
    const oldSegments = document.querySelectorAll(".snake-segment");

    oldSegments.forEach(segment => {
        segment.remove();
    });

    // Kepala
    const head = snake[0];

    snakeElement.style.left = (head.x * 5) + "%";
    snakeElement.style.top = (head.y * 5) + "%";

    // Badan
    for (let i = 1; i < snake.length; i++) {

        const segment = document.createElement("div");

        segment.classList.add("snake-segment");

        segment.style.left = (snake[i].x * 5) + "%";
        segment.style.top = (snake[i].y * 5) + "%";

        board.appendChild(segment);
    }
}


// ============================
// GAMBAR MAKANAN
// ============================

function drawFood() {

    foodElement.style.left = (food.x * 5) + "%";
    foodElement.style.top = (food.y * 5) + "%";
}


// ============================
// BUAT MAKANAN BARU
// ============================

function createFood() {

    let validPosition = false;

    while (!validPosition) {

        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);

        validPosition = !snake.some(segment =>
            segment.x === food.x &&
            segment.y === food.y
        );
    }

    drawFood();
}


// ============================
// GERAK SNAKE
// ============================

function moveSnake() {

    if (gameOver) return;

    direction = nextDirection;

    const head = snake[0];

    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Tabrak tembok
    if (
        newHead.x < 0 ||
        newHead.x >= gridSize ||
        newHead.y < 0 ||
        newHead.y >= gridSize
    ) {
        endGame();
        return;
    }

    // Tabrak badan sendiri
    const hitSelf = snake.some(segment =>
        segment.x === newHead.x &&
        segment.y === newHead.y
    );

    if (hitSelf) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    // Makan makanan
    if (
        newHead.x === food.x &&
        newHead.y === food.y
    ) {

        score += 10;

        scoreText.textContent = score;

        createFood();

    } else {

        snake.pop();

    }

    drawSnake();
}


// ============================
// GANTI ARAH
// ============================

function changeDirection(newDirection) {

    if (gameOver) return;

    if (newDirection === "up") {

        if (direction.y === 0) {
            nextDirection = {
                x: 0,
                y: -1
            };
        }

    }

    else if (newDirection === "down") {

        if (direction.y === 0) {
            nextDirection = {
                x: 0,
                y: 1
            };
        }

    }

    else if (newDirection === "left") {

        if (direction.x === 0) {
            nextDirection = {
                x: -1,
                y: 0
            };
        }

    }

    else if (newDirection === "right") {

        if (direction.x === 0) {
            nextDirection = {
                x: 1,
                y: 0
            };
        }

    }
}


// ============================
// KEYBOARD
// ============================

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (
        key === "
