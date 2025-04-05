// Game Configuration
const config = {
    width: 800,
    height: 600,
    gravity: 0.5,
    friction: 0.8,
    jumpForce: -12,
    playerSpeed: 4,
    canvas: null,
    ctx: null,
    sprites: {},
    keys: {
        left: false,
        right: false,
        up: false
    }
};

// Game state
let gameState = {
    score: 0,
    health: 100,
    currentLevel: 0,
    gameStarted: false,
    showIntro: true,
    showLoading: true,
    showMessage: false,
    currentMessage: ""
};

// Levels
const levels = [
    {
        name: "tampa",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 200, height: 20 },
            { x: 500, y: 400, width: 200, height: 20 },
            { x: 150, y: 350, width: 150, height: 20 },
            { x: 400, y: 300, width: 150, height: 20 }
        ],
        obstacles: [
            { x: 300, y: 500, width: 40, height: 40 }
        ],
        collectibles: [
            { x: 250, y: 400, width: 30, height: 30, collected: false },
            { x: 550, y: 350, width: 30, height: 30, collected: false }
        ],
        memoryPhoto: { x: 400, y: 250, width: 60, height: 40, collected: false }
    },
    {
        name: "sdsu",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 300, y: 480, width: 200, height: 20 },
            { x: 100, y: 410, width: 150, height: 20 },
            { x: 500, y: 340, width: 200, height: 20 }
        ],
        obstacles: [
            { x: 400, y: 500, width: 40, height: 40 }
        ],
        collectibles: [
            { x: 350, y: 420, width: 30, height: 30, collected: false },
            { x: 150, y: 350, width: 30, height: 30, collected: false }
        ],
        memoryPhoto: { x: 350, y: 240, width: 60, height: 40, collected: false }
    },
    {
        name: "pb",
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 480, width: 150, height: 20 },
            { x: 450, y: 400, width: 150, height: 20 },
            { x: 700, y: 320, width: 100, height: 20 }
        ],
        obstacles: [
            { x: 300, y: 500, width: 40, height: 40 }
        ],
        collectibles: [
            { x: 250, y: 440, width: 30, height: 30, collected: false },
            { x: 500, y: 360, width: 30, height: 30, collected: false }
        ],
        memoryPhoto: { x: 500, y: 210, width: 60, height: 40, collected: false }
    }
];

// Player object
const player = {
    x: 50,
    y: 450,
    width: 50,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    canJump: true,
    
    update() {
        // Apply gravity
        this.velocityY += config.gravity;
        
        // Apply horizontal movement
        if (config.keys.left) {
            this.velocityX = -config.playerSpeed;
        } else if (config.keys.right) {
            this.velocityX = config.playerSpeed;
        } else {
            this.velocityX *= config.friction;
        }
        
        // Jumping
        if (config.keys.up && !this.isJumping && this.canJump) {
            this.velocityY = config.jumpForce;
            this.isJumping = true;
            this.canJump = false;
        }
        
        // Reset jump ability when key is released
        if (!config.keys.up) {
            this.canJump = true;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > config.width - this.width) this.x = config.width - this.width;
        
        // Platform collision
        this.checkPlatformCollision();
        
        // Check level completion
        this.checkLevelCompletion();
    },
    
    checkPlatformCollision() {
        const currentLevel = levels[gameState.currentLevel];
        
        for (const platform of currentLevel.platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y - 5 &&
                this.y + this.height < platform.y + 15 &&
                this.velocityY > 0) {
                
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
        
        // Check fall off screen
        if (this.y > config.height) {
            gameState.health -= 10;
            this.x = 50;
            this.y = 450;
            this.velocityX = 0;
            this.velocityY = 0;
            
            if (gameState.health <= 0) {
                gameOver();
            }
        }
    },
    
    checkLevelCompletion() {
        const currentLevel = levels[gameState.currentLevel];
        
        if (currentLevel.memoryPhoto && currentLevel.memoryPhoto.collected) {
            if (gameState.currentLevel < levels.length - 1) {
                // Move to next level
                gameState.currentLevel++;
                this.x = 50;
                this.y = 450;
                this.velocityX = 0;
                this.velocityY = 0;
            } else {
                // Victory
                gameOver(true);
            }
        }
    }
};

// Function to check collisions
function checkCollisions() {
    const currentLevel = levels[gameState.currentLevel];
    
    // Check memory photo collision
    if (!currentLevel.memoryPhoto.collected &&
        player.x < currentLevel.memoryPhoto.x + currentLevel.memoryPhoto.width &&
        player.x + player.width > currentLevel.memoryPhoto.x &&
        player.y < currentLevel.memoryPhoto.y + currentLevel.memoryPhoto.height &&
        player.y + player.height > currentLevel.memoryPhoto.y) {
        
        currentLevel.memoryPhoto.collected = true;
        gameState.score += 500;
        showMessage("Memory photo collected!");
    }
    
    // Check collectibles
    for (const collectible of currentLevel.collectibles) {
        if (!collectible.collected &&
            player.x < collectible.x + collectible.width &&
            player.x + player.width > collectible.x &&
            player.y < collectible.y + collectible.height &&
            player.y + player.height > collectible.y) {
            
            collectible.collected = true;
            gameState.score += 100;
            showMessage("Item collected!");
        }
    }
    
    // Check obstacles
    for (const obstacle of currentLevel.obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            
            gameState.health -= 10;
            player.velocityY = config.jumpForce * 0.7; // Bounce back
            
            if (gameState.health <= 0) {
                gameOver(false);
            }
        }
    }
}

// Update game state
function updateGame() {
    player.update();
    checkCollisions();
}

// Draw game
function drawGame() {
    const ctx = config.ctx;
    const currentLevel = levels[gameState.currentLevel];
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw background - nice gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    if (currentLevel.name === 'tampa') {
        gradient.addColorStop(0, "#ffafbd");
        gradient.addColorStop(1, "#ffc3a0");
    } else if (currentLevel.name === 'sdsu') {
        gradient.addColorStop(0, "#2193b0");
        gradient.addColorStop(1, "#6dd5ed");
    } else {
        gradient.addColorStop(0, "#4facfe");
        gradient.addColorStop(1, "#00f2fe");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw memory photo if not collected
    if (!currentLevel.memoryPhoto.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(currentLevel.memoryPhoto.x, 
                    currentLevel.memoryPhoto.y, 
                    currentLevel.memoryPhoto.width, 
                    currentLevel.memoryPhoto.height);
        
        // Label
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Collect!', 
                   currentLevel.memoryPhoto.x + currentLevel.memoryPhoto.width/2,
                   currentLevel.memoryPhoto.y - 5);
        ctx.textAlign = 'left';
    }
    
    // Draw obstacles
    for (const obstacle of currentLevel.obstacles) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
    
    // Draw collectibles
    for (const collectible of currentLevel.collectibles) {
        if (!collectible.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        }
    }
    
    // Draw player
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw UI
    drawUI();
    
    // Draw message
    if (gameState.showMessage) {
        drawMessage();
    }
}

// Draw UI
function drawUI() {
    const ctx = config.ctx;
    
    // Background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 250, 80);
    
    // Health bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(20, 40, 230, 20);
    
    // Health bar
    const healthPercent = gameState.health / 100;
    const barWidth = 230 * healthPercent;
    ctx.fillStyle = '#FF5F6D';
    ctx.fillRect(20, 40, barWidth, 20);
    
    // Health text
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText("Health: " + gameState.health, 20, 30);
    
    // Score
    ctx.fillText(`Score: ${gameState.score}`, 20, 70);
}

// Draw message
function drawMessage() {
    const ctx = config.ctx;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(100, config.height - 100, config.width - 200, 80);
    
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.currentMessage, config.width/2, config.height - 60);
    
    ctx.font = '14px Arial';
    ctx.fillText('Press SPACE to continue', config.width/2, config.height - 30);
    ctx.textAlign = 'left';
}

// Show a message
function showMessage(text) {
    gameState.showMessage = true;
    gameState.currentMessage = text;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        gameState.showMessage = false;
    }, 3000);
}

// Game over
function gameOver(victory = false) {
    gameState.gameStarted = false;
    
    const ctx = config.ctx;
    
    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Draw text
    ctx.fillStyle = victory ? '#FFD700' : 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(victory ? 'Victory!' : 'Game Over', config.width/2, 200);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Press R to restart', config.width/2, 300);
    
    ctx.textAlign = 'left';
}

// Intro screen
function drawIntroScreen() {
    const ctx = config.ctx;
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#4a5568');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Bella's Quest", config.width/2, 150);
    
    ctx.font = '24px Arial';
    ctx.fillText("A Journey Through Memories", config.width/2, 200);
    
    // Instructions
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("Controls:", config.width/2, 280);
    ctx.font = '16px Arial';
    ctx.fillText("Arrow Keys to move, Space to jump", config.width/2, 310);
    
    // Start button
    ctx.fillStyle = '#f06292';
    ctx.fillRect(config.width/2 - 100, 350, 200, 50);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("Start Game", config.width/2, 380);
    
    ctx.textAlign = 'left';
}

// Loading screen
function drawLoadingScreen() {
    const ctx = config.ctx;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Loading...", config.width/2, config.height/2);
    ctx.textAlign = 'left';
    
    // Auto-complete loading after 2 seconds
    setTimeout(() => {
        gameState.showLoading = false;
        gameState.showIntro = true;
    }, 2000);
}

// Set up controls
function setupControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                config.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                config.keys.right = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                config.keys.up = true;
                // Dismiss message if showing
                if (gameState.showMessage) {
                    gameState.showMessage = false;
                }
                break;
            case 'r':
            case 'R':
                resetGame();
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                config.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                config.keys.right = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                config.keys.up = false;
                break;
        }
    });
    
    // Handle clicks for buttons
    config.canvas.addEventListener('click', (e) => {
        const rect = config.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (gameState.showIntro) {
            // Check for start button click
            if (x >= config.width/2 - 100 && x <= config.width/2 + 100 &&
                y >= 350 && y <= 400) {
                resetGame();
            }
        }
    });
}

// Reset game
function resetGame() {
    gameState.score = 0;
    gameState.health = 100;
    gameState.currentLevel = 0;
    gameState.gameStarted = true;
    gameState.showIntro = false;
    
    player.x = 50;
    player.y = 450;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    
    // Reset collectibles and memory photos
    for (const level of levels) {
        for (const collectible of level.collectibles) {
            collectible.collected = false;
        }
        
        if (level.memoryPhoto) {
            level.memoryPhoto.collected = false;
        }
    }
    
    showMessage("Level " + (gameState.currentLevel + 1) + " - " + levels[gameState.currentLevel].name);
}

// Game loop
function gameLoop() {
    if (gameState.showLoading) {
        drawLoadingScreen();
    } else if (gameState.showIntro) {
        drawIntroScreen();
    } else if (gameState.gameStarted) {
        updateGame();
        drawGame();
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    // Create canvas
    config.canvas = document.createElement('canvas');
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    config.canvas.style.display = 'block';
    config.ctx = config.canvas.getContext('2d');
    
    // Add canvas to page
    const container = document.getElementById('game-container');
    if (container) {
        container.appendChild(config.canvas);
    } else {
        document.body.appendChild(config.canvas);
    }
    
    // Setup controls
    setupControls();
    
    // Start game loop
    gameState.showLoading = true;
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.onload = function() {
    initGame();
}; 