const canvas = document.getElementById('game');

// This line gets the 2D rendering context for the <canvas> element. 
// It’s what allows you to draw shapes, lines, text, and images on the canvas.
const ctx = canvas.getContext('2d');

// Size of each square in the grid
const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }]; // Initial position of the snake
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};

let dx = box; // Initial direction of the snake. Move right by 1 box
let dy = 0;
let game;

let gameState = 'start'; // 'start', 'playing', 'gameover'

document.addEventListener('keydown', function(e) {
  if (e.key === ' ') {
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
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}


function direction(e) {
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -box;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = box;
        dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -box;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = box;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        // Draw start screen
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
    }

    else if (gameState === 'playing') {
        // Draw snake
        // Loop through each part of the snake and draw it
        snake.forEach(part => {
            ctx.fillStyle = 'lime';
            ctx.fillRect(part.x, part.y, box, box);
        });

        // Draw food at food.x and food.y position
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

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
            draw(); // Call draw again to show game over screen
            return;
        }

        snake.unshift(head);

        // Eat food
        if (head.x === food.x && head.y === food.y) {
            // Generate new food position
            food = {
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box,
            };
        } else {
            // Remove the last part of the snake if food is not eaten
            snake.pop();
        }
    }
    else if (gameState === 'gameover') {
        // Draw game over screen
        ctx.fillStyle = 'White';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center'; 
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Runs draw() every 250ms to animate the game.
game = setInterval(draw, 250);
