//board vars
let board;
let boardHeight = 576;
let boardWidth = 360;
let context;

//mario vars
let marioWidth = 45;
let marioHeight = 45;
let marioX = boardWidth / 2 - marioWidth / 2;
let marioY = boardHeight * 7 / 8 - marioHeight;
let marioRightImage;
let marioLeftImage;

let mario = {
    img: null,
    x: marioX,
    y: marioY,
    width: marioWidth,
    height: marioHeight
};

//physics
let velocityX = 0;
let velocityY = 0;
const initialVelocityY = -8;
const gravity = 0.4;

//platforms
let platformArray = [];
const platformWidth = 60;
const platformHeight = 19;
let platformImg;

//score
let score = 0;
let highScore = 0;
let isNewHighScore = false;
let gameOver = false;

window.onload = function () {
    //draw board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Retrieve high score from localStorage
    highScore = localStorage.getItem("highScore") || 0;

    //images
    //Right image
    marioRightImage = new Image();
    marioRightImage.src = "./images/super-mario-right.png";
    mario.img = marioRightImage;

    //Left image
    marioLeftImage = new Image();
    marioLeftImage.src = "./images/super-mario-left.png";

    platformImg = new Image();
    platformImg.src = "./images/platform.png";

    velocityY = initialVelocityY;
    //animation loop
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveMario);
};

//update
function update() {
    setTimeout(() => requestAnimationFrame(update), 20);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //mario
    mario.x += velocityX;
    if (mario.x > boardWidth) {
        mario.x = 0;
    } else if (mario.x + mario.width < 0) {
        mario.x = boardWidth;
    }

    velocityY += gravity;
    mario.y += velocityY;
    if (mario.y > board.height) {
        gameOver = true;
        updateHighScore();
    }
    context.drawImage(mario.img, mario.x, mario.y, mario.width, mario.height);

    //platform
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && mario.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY;
        }
        if (Collision(mario, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //clear platforms and add new ones
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        generatePlatform();
    }

    //update score
    updateScore();
    context.fillStyle = "purple";
    context.font = "16px bold sans-serif";
    context.fillText(`Current score: ${score}`, 5, 20);
    context.fillText(`High score: ${highScore}`, 250, 20);

    if (gameOver) {
        context.fillStyle = "black";
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth / 7, boardHeight / 2);
        if(isNewHighScore){
            context.fillText("New High Score!", boardWidth / 2 - 50, boardHeight / 2 + 30);
        }
    }
}

//move mario
function moveMario(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        mario.img = marioRightImage;
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -4;
        mario.img = marioLeftImage;
    } else if (e.code == "Space" && gameOver) {
        //reset
        mario = {
            img: marioRightImage,
            x: marioX,
            y: marioY,
            width: marioWidth,
            height: marioHeight
        };
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        gameOver = false;
        placePlatforms();
    }
}

//placing platforms
function placePlatforms() {
    platformArray = [];

    //platform object
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    };

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); //random x position
        platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        };

        platformArray.push(platform);
    }
}

function generatePlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); //random x position
    const platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    };

    platformArray.push(platform);
}

function Collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function updateScore() {
    let points = 1;
    if (velocityY < 0) {
        score += points;
        if (score > highScore) {
            isNewHighScore = true;
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    } else if (velocityY >= 0) {
        score += 5;
    }
}

function updateHighScore() {
    if (score > highScore) {
        isNewHighScore = true;
        highScore = score;
        localStorage.setItem("highScore", highScore);
        
    }
    else{
        isNewHighScore = false;
    }
}
