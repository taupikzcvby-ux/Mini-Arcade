const statusText = document.getElementById("status");
const resultText = document.getElementById("result");
const restartButton = document.getElementById("restart");

const MAX_HP = 100;

const ACTIONS = {
    punch: { damage: 8, cooldown: 500 },
    kick: { damage: 15, cooldown: 1000 },
    block: { cooldown: 2000, duration: 900, reduction: 0.25 }
};

let gameActive = true;

const players = {
    1: {
        hp: MAX_HP,
        blocking: false,
        cooldowns: { punch: false, kick: false, block: false },
        fighterEl: document.getElementById("fighter1"),
        hpFillEl: document.getElementById("hpFill1"),
        hpValueEl: document.getElementById("hpValue1")
    },
    2: {
        hp: MAX_HP,
        blocking: false,
        cooldowns: { punch: false, kick: false, block: false },
        fighterEl: document.getElementById("fighter2"),
        hpFillEl: document.getElementById("hpFill2"),
        hpValueEl: document.getElementById("hpValue2")
    }
};

function otherPlayer(num) {
    return num === 1 ? 2 : 1;
}

function getButton(playerNum, action) {
    return document.querySelector(
        `.action-btn[data-player="${playerNum}"][data-action="${action}"]`
    );
}

function setCooldown(playerNum, action, ms) {
    const player = players[playerNum];
    const button = getButton(playerNum, action);

    player.cooldowns[action] = true;
    if (button) button.disabled = true;

    setTimeout(() => {
        player.cooldowns[action] = false;
        if (button) button.disabled = false;
    }, ms);
}

function updateHpUI(playerNum) {
    const player = players[playerNum];
    const percent = Math.max(0, (player.hp / MAX_HP) * 100);

    player.hpFillEl.style.width = percent + "%";
    player.hpValueEl.textContent = Math.max(0, player.hp);
}

function showHitEffect(playerNum) {
    const player = players[playerNum];
    player.fighterEl.classList.add("hit");
    setTimeout(() => player.fighterEl.classList.remove("hit"), 250);
}

function showBlockedEffect(playerNum) {
    const player = players[playerNum];
    player.fighterEl.classList.add("blocked-hit");
    setTimeout(() => player.fighterEl.classList.remove("blocked-hit"), 300);
}

function performAttack(playerNum, action) {
    if (!gameActive) return;

    const player = players[playerNum];
    const opponentNum = otherPlayer(playerNum);
    const opponent = players[opponentNum];

    if (player.cooldowns[action]) return;

    const { damage, cooldown } = ACTIONS[action];
    const actionLabel = action === "punch" ? "PUKULAN" : "TENDANGAN";

    const wasBlocked = opponent.blocking;
    let finalDamage = damage;

    if (wasBlocked) {
        finalDamage = Math.max(1, Math.round(damage * ACTIONS.block.reduction));
    }

    opponent.hp = Math.max(0, opponent.hp - finalDamage);
    updateHpUI(opponentNum);

    if (wasBlocked) {
        showBlockedEffect(opponentNum);
    } else {
        showHitEffect(opponentNum);
    }

    setCooldown(playerNum, action, cooldown);

    if (opponent.hp <= 0) {
        endGame(playerNum);
        return;
    }

    if (wasBlocked) {
        statusText.textContent = `Player ${opponentNum} BERHASIL BLOK ${actionLabel} Player ${playerNum}! (-${finalDamage})`;
    } else {
        statusText.textContent = `Player ${playerNum} pakai ${actionLabel}! (-${finalDamage})`;
    }
}

function performBlock(playerNum) {
    if (!gameActive) return;

    const player = players[playerNum];

    if (player.cooldowns.block) return;

    player.blocking = true;
    player.fighterEl.classList.add("blocking");

    setCooldown(playerNum, "block", ACTIONS.block.cooldown);

    setTimeout(() => {
        player.blocking = false;
        player.fighterEl.classList.remove("blocking");
    }, ACTIONS.block.duration);

    statusText.textContent = `Player ${playerNum} bertahan!`;
}

function handleAction(playerNum, action) {
    if (action === "block") {
        performBlock(playerNum);
    } else {
        performAttack(playerNum, action);
    }
}

function endGame(loserNum) {
    const winnerNum = otherPlayer(loserNum);

    gameActive = false;
    statusText.textContent = "Game selesai";
    resultText.textContent = `Player ${winnerNum} MENANG!`;

    players[loserNum].fighterEl.classList.add("ko");

    document.querySelectorAll(".action-btn").forEach((btn) => {
        btn.disabled = true;
    });
}

document.querySelectorAll(".action-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const playerNum = Number(button.dataset.player);
        const action = button.dataset.action;
        handleAction(playerNum, action);
    });
});

const KEY_MAP = {
    a: [1, "punch"],
    s: [1, "kick"],
    d: [1, "block"],
    j: [2, "punch"],
    k: [2, "kick"],
    l: [2, "block"]
};

document.addEventListener("keydown", (e) => {
    const mapping = KEY_MAP[e.key.toLowerCase()];
    if (!mapping) return;

    const [playerNum, action] = mapping;
    handleAction(playerNum, action);
});

restartButton.addEventListener("click", () => {
    gameActive = true;

    [1, 2].forEach((num) => {
        const player = players[num];
        player.hp = MAX_HP;
        player.blocking = false;
        player.cooldowns = { punch: false, kick: false, block: false };
        player.fighterEl.classList.remove("blocking", "ko");
        updateHpUI(num);
    });

    document.querySelectorAll(".action-btn").forEach((btn) => {
        btn.disabled = false;
    });

    statusText.textContent = "Bertarung!";
    resultText.textContent = "";
});
            
