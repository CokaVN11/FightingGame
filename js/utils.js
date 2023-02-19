const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

function rectCollision(rect1, rect2) {
    return (rect1.attackBox.pos.x + rect1.attackBox.width >= rect2.pos.x &&
        rect1.attackBox.pos.x <= rect2.pos.x + rect2.width &&
        rect1.attackBox.pos.y + rect1.attackBox.height >= rect2.pos.y &&
        rect1.attackBox.pos.y <= rect2.pos.y + rect2.height)
}

let timer = 60;
let timerID;

function displayWinner(player, enemy, timerID) {
    clearTimeout(timerID);
    document.getElementById('displayRes').style.display = "flex";
    if (player.health == enemy.health) {
        document.getElementById('displayRes').innerHTML = "Tie";
    }
    else if (player.health > enemy.health) {
        document.getElementById('displayRes').innerHTML = "Player 1 Wins";
    }
    else {
        document.getElementById('displayRes').innerHTML = "Player 2 Wins";
    }
}

function decreaseTimer() {
    if (timer > 0) {
        --timer;
        timerID = setTimeout(decreaseTimer, 1000);
        document.getElementById('timer').innerHTML = timer;
    }

    if (timer === 0) {
        displayWinner(player, enemy, timerID);
    }
}