const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let lastKey = "";
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

class Sprite {
    constructor({ pos, velocity, color, offset }) {
        this.pos = pos;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            pos: {
                x: this.pos.x,
                y: this.pos.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        // attack box
        if (this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(
                this.attackBox.pos.x,
                this.attackBox.pos.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() {
        this.draw();
        this.attackBox.pos.x = this.pos.x + this.attackBox.offset.x;
        this.attackBox.pos.y = this.pos.y + this.attackBox.offset.y;

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

        if (this.pos.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false }, 100);
    }
}

let player = new Sprite({
    pos: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    color: "red"
});

const enemy = new Sprite({
    pos: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    color: "blue"
});

function rectCollision(rect1, rect2) {
    return (rect1.attackBox.pos.x + rect1.attackBox.width >= rect2.pos.x &&
        rect1.attackBox.pos.x <= rect2.pos.x + rect2.width &&
        rect1.attackBox.pos.y + rect1.attackBox.height >= rect2.pos.y &&
        rect1.attackBox.pos.y <= rect2.pos.y + rect2.height)
}

let timer = 10;
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

decreaseTimer();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player Movement
    if (keys.a.pressed && player.lastKey === "a") player.velocity.x = -5;
    else if (keys.d.pressed && player.lastKey === "d") player.velocity.x = 5;

    // enenmy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft")
        enemy.velocity.x = -5;
    else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight")
        enemy.velocity.x = 5;

    if (rectCollision(player, enemy) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.getElementById('enemyHealth').style.width = enemy.health + '%';
    }

    if (rectCollision(enemy, player) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.getElementById('playerHealth').style.width = player.health + '%';
    }

    if (player.health <= 0 || enemy.health <= 0) {
        displayWinner(player, enemy, timerID);
    }
}

animate();

addEventListener("keydown", (e) => {
    // console.log(e.key);
    switch (e.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a";
            break;
        case "w":
            player.velocity.y = -10;
            break;

        case ' ':
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -10;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
    }
});

addEventListener("keyup", (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
    }
});
