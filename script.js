const canvas = document.getElementById('game');
// This line gets the 2D rendering context for the <canvas> element. 
// It’s what allows you to draw shapes, lines, text, and images on the canvas.
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

// Size of each square in the grid
const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }]; // Initial position of the snake
let food = {
    x: Math.floor(Math.random() * 30) * box,
    y: Math.floor(Math.random() * 30) * box,
};

let dx = box; // Initial direction of the snake. Move right by 1 box
let dy = 0;
let game;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameState = 'start'; // 'start', 'playing', 'gameover'

// Update high score display
highScoreElement.textContent = highScore;

document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        e.preventDefault(); // Prevent scrolling down when spacebar is pressed
        if (gameState === 'start' || gameState === 'gameover') {
            resetGame();
            gameState = 'playing';
            game = setInterval(draw, 100);
        }
    } else {
        if (gameState === 'playing') {
            direction(e); // existing function to handle arrow keys
        }
    }
});

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    dx = box;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    food = {
        x: Math.floor(Math.random() * 30) * box,
        y: Math.floor(Math.random() * 30) * box,
    };
}


function direction(e) {
  const key = e.key.toLowerCase(); // normalize to lowercase

  if (key === 'a' && dx === 0) {
    dx = -box;
    dy = 0;
  } else if (key === 'd' && dx === 0) {
    dx = box;
    dy = 0;
  } else if (key === 'w' && dy === 0) {
    dx = 0;
    dy = -box;
  } else if (key === 's' && dy === 0) {
    dx = 0;
    dy = box;
  }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines for better visibility
    ctx.strokeStyle = '#2a3f5f';
    for (let i = 0; i < canvas.width; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    if (gameState === 'start') {
        // Draw start screen
        ctx.fillStyle = '#f8fafc';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
    }

    else if (gameState === 'playing') {
        // Draw snake
        // Loop through each part of the snake and draw it
        snake.forEach((part, index) => {
            // Head is a different color
            if (index === 0) {
                ctx.fillStyle = '#4ade80'; // Bright green for head
            } else {
                // Gradient color for body parts
                const colorValue = 250 - (index * 10);
                ctx.fillStyle = `rgb(0, ${Math.max(colorValue, 50)}, 0)`;
            }
            ctx.fillRect(part.x, part.y, box, box);

            // Add eyes to the head
            if (index === 0) {
                ctx.fillStyle = '#000';
                
                // Position eyes based on direction
                if (dx > 0) { // Moving right
                    ctx.fillRect(part.x + box - 5, part.y + 5, 3, 3);
                    ctx.fillRect(part.x + box - 5, part.y + box - 8, 3, 3);
                } else if (dx < 0) { // Moving left
                    ctx.fillRect(part.x + 2, part.y + 5, 3, 3);
                    ctx.fillRect(part.x + 2, part.y + box - 8, 3, 3);
                } else if (dy > 0) { // Moving down
                    ctx.fillRect(part.x + 5, part.y + box - 5, 3, 3);
                    ctx.fillRect(part.x + box - 8, part.y + box - 5, 3, 3);
                } else { // Moving up
                    ctx.fillRect(part.x + 5, part.y + 2, 3, 3);
                    ctx.fillRect(part.x + box - 8, part.y + 2, 3, 3);
                }
            }
        });

        // Draw food at food.x and food.y position
        //ctx.fillStyle = 'red';
        //ctx.fillRect(food.x, food.y, box, box);\
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;


        // Move snake
        let head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Game over conditions
        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height ||
            snake.some(part => part.x === head.x && part.y === head.y)
        ) {
            gameState = 'gameover';
            clearInterval(game);

            // Update high score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreElement.textContent = highScore;
            }

            draw(); // Call draw again to show game over screen
            return;
        }

        snake.unshift(head);

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score++;
            scoreElement.textContent = score;

            // Generate new food position
            food = {
                x: Math.floor(Math.random() * 30) * box,
                y: Math.floor(Math.random() * 30) * box,
            };

            // Make sure food doesn't spawn on snake
            while (snake.some(part => part.x === food.x && part.y === food.y)) {
                food = {
                    x: Math.floor(Math.random() * 30) * box,
                    y: Math.floor(Math.random() * 30) * box,
                };
            }
        } else {
            // Remove the last part of the snake if food is not eaten
            snake.pop();
        }
    }
    else if (gameState === 'gameover') {
        // Draw game over screen
        ctx.fillStyle = '#f8fafc';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Runs draw() every 250ms to animate the game.
game = setInterval(draw, 250);
