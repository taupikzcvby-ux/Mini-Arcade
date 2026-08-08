const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turn");
const resultText = document.getElementById("result");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let gameActive = true;

let board = [
    "", "", "",
    "", "", "",
    "", ""
];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


cells[0].onclick = function() {
    makeMove(0);
};

cells[1].onclick = function() {
    makeMove(1);
};

cells[2].onclick = function() {
    makeMove(2);
};

cells[3].onclick = function() {
    makeMove(3);
};

cells[4].onclick = function() {
    makeMove(4);
};

cells[5].onclick = function() {
    makeMove(5);
};

cells[6].onclick = function() {
    makeMove(6);
};

cells[7].onclick = function() {
    makeMove(7);
};

cells[8].onclick = function() {
    makeMove(8);
};


function makeMove(index) {

    if (!gameActive) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;

    checkWinner();
}


function checkWinner() {

    for (const combination of winningCombinations) {

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            resultText.textContent =
                "Player " + currentPlayer + " MENANG!";

            turnText.textContent = "Game selesai";

            gameActive = false;

            return;
        }
    }


    if (!board.includes("")) {

        resultText.textContent = "HASILNYA SERI!";

        turnText.textContent = "Game selesai";

        gameActive = false;

        return;
    }


    currentPlayer =
        currentPlayer === "X" ? "O" : "X";

    turnText.textContent =
        "Giliran Player " + currentPlayer;
}


restartButton.addEventListener("click", function() {

    board = [
        "", "", "",
        "", "", "",
        "", ""
    ];

    currentPlayer = "X";
    gameActive = true;

    cells.forEach(function(cell) {
        cell.textContent = "";
    });

    turnText.textContent = "Giliran Player X";

    resultText.textContent = "";
});
