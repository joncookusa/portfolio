const ArcadeGame = (() => {

    // The prize class
    class Prize {

        constructor() {
            // Set the image for the prize
            this.sprite = '../images/Gem-Orange-Small.png';

            // Initially, hide the prize off the screen until the game starts once the user has selected their player
            this.x = -100;
            this.y = 0;
        }

        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        resetPrize() {
            // Method replaces the prize randomly on the road way
            this.rowNum = getRandomInt(3) + 3;
            this.colNum = getRandomInt(5) + 1;
            this.movePrize(this.rowNum, this.colNum);
        }

        movePrize(row, col) {
            // Fine tune the xy position of the prize depending on the selected row and col after the prize position is reset
            this.x = (col * 100) - 85;
            switch (row) {
                case 6 :
                    this.y = 10;
                    break;
                case 5 :
                    this.y = 90;
                    break;
                case 4 :
                    this.y = 172;
                    break;
                case 3 :
                    this.y = 255;
                    break;
                case 2 :
                    this.y = 337;
                    break;
                case 1 :
                    this.y = 419;
                    break;
                default :
                    this.y = 10;
            }
        }

    }

    // The player class
    class Player {

        constructor() {
            // Initialize the players position to be off to the side of the screen until the game starts. Set the player to have 3 lives, a score of 0, and initial position
            this.sprite = '../images/char-boy.png';
            this.x = -100;
            this.lives = 3;
            this.score = 0;
            // hasPrize flag indicates if player has picked up a prize en route
            this.hasPrize = false;
            this.currentColNum = 3;
            this.currentRowNum = 1;
        }

        // Game engine expects an update method, but as the player is controlled by the arrow keys,
        // it doesn't seem that we need this. An empty function has been left to keep the game engine happy.
        update() {

        }

        render() {
            console.log(this.sprite);
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        handleInput(direction = 'none') {

            // Depending on the arrow key pressed, update the xy position. If the y position
            // has changed, update the current row num for the palyer which will be used when checking for a collision
            switch (direction) {
                case 'left' :
                    this.x -= 101;
                    this.currentColNum--;
                    break;
                case 'right' :
                    this.x += 101;
                    this.currentColNum++;
                    break;
                case 'up' :
                    this.y -= 83;
                    this.currentRowNum++;
                    break;
                case 'down' :
                    this.y += 83;
                    this.currentRowNum--;
                    break;
            }

            // If the xy position of the player is outside of the canvas, move the player back inside the canvas limits
            if (this.x < 0) {
                this.x = 0;
                this.currentColNum = 1;
            }
            if (this.x > 400) {
                this.x = 400;
                this.currentColNum = 5;
            }
            if (this.y > 385) {
                this.y = 385;
                this.currentRowNum = 1;
            }
            if (this.y < -30) {
                this.y = -30;
                this.currentRowNum = 6;
            }

            // If the player has collided with a prize, set the hasPrize flag to be true
            if ((this.currentRowNum === prize.rowNum) && (this.currentColNum === prize.colNum)) {
                this.hasPrize = true;
            }

            // If the player has picked up the prize, move the prize position in step with the players movement so they
            // are always on the same block
            if (this.hasPrize) {
                prize.movePrize(this.currentRowNum, this.currentColNum);
            }

            // If the player has reached the water for more than a second, reset the players position and increment the score if they brought a prize
            if (this.currentRowNum === 6) {
                setTimeout(() => {
                    if (this.currentRowNum === 6) {
                        if (this.hasPrize) {
                            this.incrementScore();
                        }
                        this.resetPlayer();
                    }
                }, 1000)
            }

        }

        // Method will be called from the enemy object, in the event that an enemy collides with the player. The players lives will be reduced and the player's position
        // will be reset along with any prize. The UI will also be updated.
        collided() {
            this.lives--;
            document.querySelector(".lives-remaining").innerText = `Lives remaining : ${this.lives}`;
            this.resetPlayer();
        }

        // Increment the score
        incrementScore() {
            this.score++;
            document.querySelector(".score").innerText = `Score : ${this.score}`;
        }

        // Reset the player to the starting position
        resetPlayer() {
            this.x = 202;
            this.y = 385;
            this.currentRowNum = 1;
            this.currentColNum = 3;
            // If the player has the prize, reset the prize to a random spot on the grid
            if (this.hasPrize) {
                this.hasPrize = false;
                prize.resetPrize();
            }
        }

    }

    class Enemy {

        // Accepts the player as an argument, so that we can test for collisions every update cycle
        constructor(player, prize) {
            // Set the enemy image
            this.sprite = '../images/enemy-bug.png';

            this.player = player;

            this.prize = prize;

            // Initialize the enemy
            this.resetEnemy();
        }

        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        update(dt) {
            // You should multiply any movement by the dt parameter
            // which will ensure the game runs at the same speed for
            // all computers.
            this.x = Math.round(this.x + (this.speed * dt));

            // If the x position is betond the edge of the canvas, reset the enemy to a new starting spot and speed
            if (this.x > 700) {
                this.resetEnemy();
            }

            // Check for a player collision. If the enemy is in the same row as the player and their x positions overlap, then reset the player
            if ((this.x > this.player.x - 50) && (this.x < this.player.x + 50) && (this.rowNum === this.player.currentRowNum)) {
                player.collided();
            }

            // Check for a prize collision. If the enemy is in the same row as the prize and their x positions overlap, then reset the prize
            if (!player.hasPrize && (this.x > this.prize.x - 95) && (this.x < this.prize.x + 50) && (this.rowNum === this.prize.rowNum)) {
                prize.resetPrize();
            }
        }

        render() {
            // Draw the enemy on the screen, required method for game
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        resetEnemy() {
            // Reset the enemy to be before the start of the canvas
            this.x = -100;

            // Select a random row for the enemy to traverse. Either row 3,4 or 5 and set the corresponding y coordinate
            this.rowNum = getRandomInt(3) + 3;
            switch (this.rowNum) {
                case 5 :
                    this.y = 60;
                    break;
                case 4 :
                    this.y = 145;
                    break;
                case 3 :
                    this.y = 230;
                    break;
                default :
                    this.y = 60;
            }

            // Select a random speed for the enemy
            this.speed = getRandomInt(400) + 100;
        }
    }

    // Helper function to return a random integer
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // Helper function to decrement the time on the UI
    function decrementTime(timeLeft) {
        document.querySelector(".time").innerText = `Time left : ${timeLeft}`;
    }

    // Helper function to display the game on prompt
    function showGameOn() {
        document.querySelector('.click-to-start').style.display = 'none';
        document.querySelector('.game-on').style.display = 'block';
    }

    // Helper function to display the start game prompt
    function showGameStart() {
        document.querySelector('.click-to-start').style.display = 'block';
        document.querySelector('.game-on').style.display = 'none';
    }

    // Helper function to display the game info and hide the game over info
    function showGameInfo() {
        document.querySelector('.game-over').style.display = 'none';
        document.querySelector('.game-info').style.display = 'block';
    }

    // Helper function to hide the game info and display the game over info
    function showGameOver() {
        document.querySelector('.game-over').innerText = `Game Over. You scored ${player.score} points`;
        document.querySelector('.game-over').style.display = 'block';
        document.querySelector('.game-info').style.display = 'none';
    }

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function (e) {
        if (startGame) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            player.handleInput(allowedKeys[e.keyCode]);
        }
    });

    // Event listener that listens for a click on a character which sets the character for the game and also starts the game.
    document.querySelector(".characters").addEventListener('click', (e) => {
        // Prevent the click from doing anything if the game has already started
        if (!startGame) {
            // Set the player sprite
            let playerImageElement = e.target;
            player.sprite = playerImageElement.dataset.name;

            // Reset the score and player position and lives along with the UI element
            player.score = -1;
            player.incrementScore();
            player.resetPlayer();
            player.lives = 3;
            document.querySelector(".lives-remaining").innerText = `Lives remaining : ${player.lives}`;

            // Reset the prize position
            prize.resetPrize();

            // Add the enemies to the array
            for (let i = 0; i < 3; i++) {
                allEnemies.push(new Enemy(player, prize));
            }

            // Start the game and update the UI with the game stats
            startGame = true;
            showGameInfo();
            showGameOn();

            // Set the game clock and a timer to decrease the time
            timeLeft = 60;
            decrementTime(timeLeft);
            gameClock = setInterval(() => {
                timeLeft--;
                decrementTime(timeLeft);
            }, 1000);
        }
    });

    // Global declarations
    let startGame = false;
    let gameClock = null;
    let timeLeft = 60;


    let prize = new Prize();
    let player = new Player(prize);

    // Initialize the UI when the page loads
    showGameInfo();
    showGameStart();

    // Set a timer to check the game status every tenth of a second. If the player lives are reduced to zero,
    // or the game clock hits zero, then end the game by showing the game over information, and removing the player, prize and enemies from the canvas
    setInterval(() => {
        if ((startGame) && ((player.lives === 0) || (timeLeft === 0))) {
            clearInterval(gameClock);
            startGame = false;
            showGameOver();
            showGameStart();
            player.x = -100;
            prize.x = -100;
            for (let i = 0; i < 3; i++) {
                allEnemies.pop();
            }
        }
    }, 100);

    let allEnemies = [];
    return {
        allEnemies: () => {
            return allEnemies;
        },
        player: () => {
            return player;
        },
        prize: () => {
            return prize;
        }

    };
})();

const allEnemies = ArcadeGame.allEnemies();
const player = ArcadeGame.player();
const prize = ArcadeGame.prize();



