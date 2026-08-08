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

let direction = "right";
let nextDirection = "right";

let score = 0;
let gameOver = false;


// ======================
// GAMBAR SNAKE
// ======================

function drawSnake() {

    document.querySelectorAll(".snake-segment").forEach(segment => {
        segment.remove();
    });

    const head = snake[0];

    snakeElement.style.left = (head.x * 5) + "%";
    snakeElement.style.top = (head.y * 5) + "%";

    for (let i = 1; i < snake.length; i++) {

        const segment = document.createElement("div");

        segment.className = "snake-segment";

        segment.style.left = (snake[i].x * 5) + "%";
        segment.style.top = (snake[i].y * 5) + "%";

        board.appendChild(segment);
    }
}


// ======================
// GAMBAR MAKANAN
// ======================

function drawFood() {

    foodElement.style.left = (food.x * 5) + "%";
    foodElement.style.top = (food.y * 5) + "%";
}


// ======================
// MAKANAN BARU
// ======================

function newFood() {

    do {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);

    } while (
        snake.some(part =>
            part.x === food.x &&
            part.y === food.y
        )
    );

    drawFood();
}


// ======================
// GERAK
// ======================

function moveSnake() {

    if (gameOver) return;

    direction = nextDirection;

    let head = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (direction === "up") {
        head.y--;
    }

    if (direction === "down") {
        head.y++;
    }

    if (direction === "left") {
        head.x--;
    }

    if (direction === "right") {
        head.x++;
    }


    // Tabrak dinding

    if (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize
    ) {
        endGame();
        return;
    }


    // Tabrak badan

    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            endGame();
            return;
        }
    }


    snake.unshift(head);


    // Makan

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        scoreText.textContent = score;

        newFood();

    } else {

        snake.pop();

    }


    drawSnake();
}


// ======================
// GANTI ARAH
// ======================

function changeDirection(newDirection) {

    if (gameOver) return;


    if (newDirection === "up" && direction !== "down") {
        nextDirection = "up";
    }

    if (newDirection === "down" && direction !== "up") {
        nextDirection = "down";
    }

    if (newDirection === "left" && direction !== "right") {
        nextDirection = "left";
    }

    if (newDirection === "right" && direction !== "left") {
        nextDirection = "right";
    }
}


// ======================
// KEYBOARD
// ======================

document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {
        event.preventDefault();
        changeDirection("up");
    }

    else if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {
        event.preventDefault();
        changeDirection("down");
    }

    else if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        event.preventDefault();
        changeDirection("left");
    }

    else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        event.preventDefault();
        changeDirection("right");
    }

});


// ======================
// GAME OVER
// ======================

function endGame() {

    gameOver = true;

    finalScore.textContent = score;

    gameOverScreen.style.display = "flex";
}


// ======================
// RESTART
// ======================

function restartGame() {
    location.reload();
}


// ======================
// KEMBALI
// ======================

function goBack() {
    window.location.href = "../../index.html";
}


// ======================
// MULAI
// ======================

drawSnake();
drawFood();

setInterval(moveSnake, 150);
