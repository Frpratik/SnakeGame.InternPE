let canvas = document.getElementById("snakeGame");
let ctx = canvas.getContext("2d");

let box = 20;
let snake = [
    { x: 9 * box, y: 9 * box },
    { x: 8 * box, y: 9 * box },
    { x: 7 * box, y: 9 * box }
];
let direction;
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};
let score = 0;
let gameLoop;
let speed = 200;
let gameOver = false;
let gameStarted = false; // New flag to track if game has started

document.addEventListener("keydown", directionHandler);

// Draw the initial board when the page loads
window.onload = function() {
    drawInitialBoard();
};

function directionHandler(event) {
    if (!gameStarted || !direction) return;
    if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
    else if (event.keyCode == 38 && direction != "DOWN") direction = "UP";
    else if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
    else if (event.keyCode == 40 && direction != "UP") direction = "DOWN";
}

function startGame() {
    score = 0;
    snake = [
        { x: 9 * box, y: 9 * box },
        { x: 8 * box, y: 9 * box },
        { x: 7 * box, y: 9 * box }
    ];
    direction = "RIGHT";
    food.x = Math.floor(Math.random() * 20) * box;
    food.y = Math.floor(Math.random() * 20) * box;
    document.getElementById("score").innerText = "Score: " + score;

    gameOver = false;
    gameStarted = true; // Set game as started
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(() => gameTick(Date.now()));
}

function drawInitialBoard() {
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#61dafb" : "#ffffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, box, box);

    document.getElementById("score").innerText = "Score: " + score;
}

function gameTick(lastTime) {
    if (gameOver) return;
    let currentTime = Date.now();
    let elapsed = currentTime - lastTime;
    if (elapsed >= speed) {
        draw();
        lastTime = currentTime;
    }
    gameLoop = requestAnimationFrame(() => gameTick(lastTime));
}

function draw() {
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#61dafb" : "#ffffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food.x = Math.floor(Math.random() * 20) * box;
        food.y = Math.floor(Math.random() * 20) * box;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        alert("Game Over! Your score: " + score);
        gameOver = true;
        gameStarted = false; // Stop game loop
        return;
    }

    snake.unshift(newHead);
    document.getElementById("score").innerText = "Score: " + score;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}
