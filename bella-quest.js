// Game Configuration
const config = {
    width: 800,
    height: 600,
    gravity: 0.4,  // Reduced gravity for more controllable jumps
    friction: 0.8, // Better friction
    jumpForce: -11, // Adjusted jump force
    playerSpeed: 4, // Slightly faster movement speed
    canvas: null,
    ctx: null,
    sprites: {},
    keys: {
        left: false,
        right: false,
        up: false
    },
    loadingProgress: 0,
    totalAssets: 0,
    loadedAssets: 0,
    loadingComplete: false
};

// Game state
let gameState = {
    score: 0,
    health: 100,
    currentLevel: 0,
    gameStarted: false,
    paused: false,
    showIntro: true,
    showLoading: true,
    messageIndex: 0,
    messageTimer: 0,
    showMessage: false,
    showingCinematicEnding: false,
    cinematicStep: 0,
    cinematicFade: 0,
    levelComplete: false  // New property to track level completion
};

// Heartfelt messages about Josephina - EDIT THESE TO CUSTOMIZE THE GAME
const heartfeltMessages = [
    "Josephina, where do I even begin? You're perfect.",
    "I love how we can openly talk about our feelings - that's huge to me.",
    "You're creative and thoughtful, a talented writer who thinks everything through.",
    "I love that you enjoy going out with your friends, but also staying active.",
    "I love your family, I love your dog Bella, and how passionate you are about your job."
];

// Custom messages for each level - EDIT THESE TO CUSTOMIZE THE GAME
const messages = {
    intro: "Help Bella explore meaningful places in Josephina's life!",
    tampa: "Tampa: Where josephina narrowly dodged being a hot cheeto girl",
    sdsu: "SDSU: Where we would drunkenly makeout without knowing eachothers last names",
    pb: "Pacific Beach: Where we came full circle",
    victory: "Bella has collected all the memories of your journey together. Every moment with you is treasured."
};

// CUSTOMIZE YOUR MEMORY PHOTOS HERE
// For each level, you can customize:
// - The memory photo message (what displays when collected)
// - Where the memory photo appears (x, y position)
// - The custom text for collectibles in each level
const levels = [
    {
        name: 'tampa',
        background: 'tampa',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 200, height: 20 },
            { x: 500, y: 400, width: 200, height: 20 },
            { x: 150, y: 350, width: 150, height: 20 },
            { x: 400, y: 300, width: 150, height: 20 },
            { x: 650, y: 250, width: 150, height: 20 },
            { x: 200, y: 200, width: 120, height: 20 },
            { x: 400, y: 150, width: 100, height: 20 },
            { x: 600, y: 100, width: 200, height: 20 }
        ],
        obstacles: [
            { x: 300, y: 500, width: 40, height: 40, type: 'gator', direction: 1, speed: 1 },
            { x: 400, y: 500, width: 30, height: 30, type: 'gator', direction: -1, speed: 1.5 },
            { x: 300, y: 250, width: 35, height: 35, type: 'bird', direction: 1, speed: 2, baseY: 250 },
            { x: 550, y: 250, width: 30, height: 30, type: 'wave', direction: 1, speed: 1.2, baseY: 250 },
            { x: 450, y: 120, width: 35, height: 35, type: 'bird', direction: -1, speed: 2.3, baseY: 120 }
        ],
        collectibles: [
            { x: 250, y: 400, width: 30, height: 30, type: 'family', collected: false, message: "I am struck by your level of creativity" },
            { x: 550, y: 350, width: 30, height: 30, type: 'health', collected: false },
            { x: 200, y: 300, width: 30, height: 30, type: 'childhood', collected: false, message: "you lift up everyone in your life" },
            { x: 450, y: 250, width: 30, height: 30, type: 'health', collected: false },
            { x: 500, y: 100, width: 30, height: 30, type: 'health', collected: false }
        ],
        // EDIT THIS TO CUSTOMIZE THE TAMPA MEMORY PHOTO
        memoryPhoto: { x: 700, y: 60, width: 60, height: 40, collected: false, 
            message: "you are beautiful inside and out" }
    },
    {
        name: 'sdsu',
        background: 'sdsu',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 300, y: 480, width: 200, height: 20 },
            { x: 100, y: 410, width: 150, height: 20 },
            { x: 500, y: 340, width: 200, height: 20 },
            { x: 300, y: 270, width: 150, height: 20 },
            { x: 100, y: 200, width: 120, height: 20 },
            { x: 400, y: 150, width: 100, height: 20 },
            { x: 650, y: 100, width: 150, height: 20 }
        ],
        obstacles: [
            { x: 600, y: 500, width: 40, height: 40, type: 'student', direction: -1, speed: 1.5 },
            { x: 380, y: 450, width: 30, height: 30, type: 'student', direction: 1, speed: 1.2 },
            { x: 250, y: 380, width: 35, height: 35, type: 'party', direction: 1, speed: 1.8, baseY: 380 },
            { x: 400, y: 240, width: 30, height: 30, type: 'wave', direction: -1, speed: 1.4, baseY: 240 },
            { x: 500, y: 120, width: 35, height: 35, type: 'student', direction: 1, speed: 2.2, baseY: 120 }
        ],
        collectibles: [
            { x: 350, y: 420, width: 30, height: 30, type: 'education', collected: false, message: "from meeting at chappy" },
            { x: 150, y: 350, width: 30, height: 30, type: 'health', collected: false },
            { x: 400, y: 300, width: 30, height: 30, type: 'friends', collected: false, message: "to surviving the black mold " },
            { x: 450, y: 180, width: 30, height: 30, type: 'health', collected: false }
        ],
        // EDIT THIS TO CUSTOMIZE THE SDSU MEMORY PHOTO
        memoryPhoto: { x: 700, y: 60, width: 60, height: 40, collected: false, 
            message: "who would have thought we would end up here." }
    },
    {
        name: 'pb',
        background: 'pb',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 480, width: 150, height: 20 },
            { x: 450, y: 400, width: 150, height: 20 },
            { x: 700, y: 320, width: 100, height: 20 },
            { x: 450, y: 240, width: 150, height: 20 },
            { x: 250, y: 180, width: 100, height: 20 },
            { x: 100, y: 120, width: 100, height: 20 },
            { x: 450, y: 80, width: 350, height: 20 }
        ],
        obstacles: [
            { x: 300, y: 500, width: 40, height: 40, type: 'surfer', direction: 1, speed: 1.8 },
            { x: 150, y: 450, width: 35, height: 35, type: 'wave', direction: 1, speed: 1.5, baseY: 450 },
            { x: 400, y: 370, width: 40, height: 40, type: 'surfer', direction: -1, speed: 2 },
            { x: 650, y: 320, width: 35, height: 35, type: 'bird', direction: -1, speed: 2.2, baseY: 290 },
            { x: 400, y: 210, width: 35, height: 35, type: 'wave', direction: 1, speed: 1.7, baseY: 210 },
            { x: 300, y: 150, width: 40, height: 40, type: 'surfer', direction: 1, speed: 2.3 },
            { x: 600, y: 50, width: 35, height: 35, type: 'wave', direction: 1, speed: 1.9, baseY: 50 }
        ],
        collectibles: [
            { x: 250, y: 440, width: 30, height: 30, type: 'adventure', collected: false, message: "from rekindling our love in pb" },
            { x: 500, y: 360, width: 30, height: 30, type: 'health', collected: false },
            { x: 650, y: 280, width: 30, height: 30, type: 'sunset', collected: false, message: "creating countless new memories" },
            { x: 300, y: 140, width: 30, height: 30, type: 'health', collected: false },
            { x: 150, y: 80, width: 30, height: 30, type: 'sunset', collected: false, message: "this place has become so special to us" }
        ],
        // EDIT THIS TO CUSTOMIZE THE PACIFIC BEACH MEMORY PHOTO
        memoryPhoto: { x: 750, y: 40, width: 60, height: 40, collected: false, 
            message: "I will forever love this place for bringing us back together" }
    }
];

// IMAGE CONFIGURATION - Update filenames or paths as needed
const gameImages = {
    // Character
    bella: 'bella_sprite.PNG',  // Note the uppercase extension
    
    // Level backgrounds
    tampaBg: 'tampa_background.png',
    sdsuBg: 'sdsu_background.png',
    pbBg: 'pb_background.png',
    
    // Game elements - placeholders, not needed
    heart: 'heart.png',
    memoryPhoto: 'memory_photo.png',
    trophy: 'trophy.png'
};

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
    facing: 'right',
    frameX: 0,
    frameY: 0,
    frameCount: 0,
    
    update() {
        // Apply gravity
        this.velocityY += config.gravity;
        
        // Apply horizontal movement based on keys
        if (config.keys.left) {
            this.velocityX = -config.playerSpeed;
            this.facing = 'left';
        } else if (config.keys.right) {
            this.velocityX = config.playerSpeed;
            this.facing = 'right';
        } else {
            // Apply friction only when no keys are pressed
            this.velocityX *= config.friction;
        }
        
        // Jumping - ultra simplified
        if (config.keys.up && !this.isJumping) {
            this.velocityY = config.jumpForce;
            this.isJumping = true;
            // Force this to true in case there's a timing issue
            config.keys.up = true;
        }
        
        // Reset jump ability when key is released
        if (!config.keys.up) {
            this.canJump = true;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Cap falling speed
        if (this.velocityY > 15) {
            this.velocityY = 15;
        }
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > config.width - this.width) this.x = config.width - this.width;
        
        // Platform collision
        this.checkPlatformCollision();
    },
    
    checkPlatformCollision() {
        const currentLevel = levels[gameState.currentLevel];
        let onPlatform = false;
        
        for (const platform of currentLevel.platforms) {
            // Ultra simplified platform collision - just check bottom of player
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y - 5 && // More forgiving collision (changed from -2)
                this.y + this.height < platform.y + 15 && // More forgiving collision (changed from +12)
                this.velocityY > 0) {
                
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
                break; // Exit loop after first collision
            }
        }
        
        // Check fall off screen - NO DAMAGE, just reset position
        if (this.y > config.height) {
            // No health reduction for falling
            
            // Just move player to a safer position
            this.x = 50;
            this.y = 450;
            this.velocityX = 0;
            this.velocityY = 0;
            
            showMessage("You fell! Try again.");
        }
    },
    
    // Simplified jump function
    jump() {
        if (!this.isJumping) {
            this.velocityY = config.jumpForce;
            this.isJumping = true;
        }
    }
};

// Initialize game - Moved this function down to be called after all definitions
function initGame() {
    // Create canvas
    config.canvas = document.createElement('canvas');
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    config.canvas.style.display = 'block'; // Ensure canvas is visible
    config.ctx = config.canvas.getContext('2d');
    
    // Insert canvas into the DOM
    const uiContainer = document.querySelector('#ui-container');
    if (uiContainer) {
        document.body.insertBefore(config.canvas, uiContainer);
    } else {
        document.body.appendChild(config.canvas);
    }
    
    // Add click listener for intro screen buttons
    config.canvas.addEventListener('click', handleCanvasClick);
    
    // Basic initialization
    loadGameImages();
    setupControls();
    setupTouchControls();
    
    // Set initial game state
    gameState.showLoading = true;
    gameState.showIntro = false;
    gameState.gameStarted = false;
    
    // Initialize the obstacles with different damage values
    initializeObstacles();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// New function to initialize obstacles with different damage values
function initializeObstacles() {
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        
        // Update the obstacles to have damage values
        for (let j = 0; j < level.obstacles.length; j++) {
            const obstacle = level.obstacles[j];
            
            // Assign different damage values based on obstacle type
            if (obstacle.type === 'wave') {
                obstacle.damage = 15; // Waves do less damage
                obstacle.color = '#4facfe'; // Blue color
            } else if (obstacle.type === 'bird') {
                obstacle.damage = 40; // Birds do more damage 
                obstacle.color = '#FF6B6B'; // Red color
            } else if (obstacle.type === 'gator' || obstacle.type === 'student' || obstacle.type === 'surfer') {
                obstacle.damage = 25; // Standard damage
                obstacle.color = '#FF0000'; // Standard red
            }
        }
        
        // Add some flying obstacles to make the game more interesting
        if (level.name === 'tampa') {
            level.obstacles.push(
                { x: 300, y: 200, width: 30, height: 30, type: 'flying', direction: 1, speed: 3, 
                baseY: 200, damage: 35, color: '#9C27B0' } // Purple flying obstacle
            );
        } else if (level.name === 'sdsu') {
            level.obstacles.push(
                { x: 200, y: 150, width: 25, height: 25, type: 'flying', direction: -1, speed: 3.5, 
                baseY: 150, damage: 35, color: '#9C27B0' } // Purple flying obstacle
            );
        } else if (level.name === 'pb') {
            level.obstacles.push(
                { x: 400, y: 100, width: 35, height: 35, type: 'flying', direction: 1, speed: 4, 
                baseY: 100, damage: 35, color: '#9C27B0' } // Purple flying obstacle
            );
        }
    }
}

// Loading screen
function drawLoadingScreen() {
    const ctx = config.ctx;
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    gradient.addColorStop(0, "#ff9a9e");
    gradient.addColorStop(1, "#fad0c4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Title
    ctx.fillStyle = '#fff';
    ctx.font = '46px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Bella's Quest", config.width/2, 150);
    ctx.font = '28px Arial';
    ctx.fillText("A journey through memories with Josephina", config.width/2, 200);
    
    // Loading bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(config.width/2 - 150, config.height/2, 300, 30);
    ctx.fillStyle = '#fff';
    ctx.fillRect(config.width/2 - 150, config.height/2, 300 * (config.loadingProgress / 100), 30);
    
    // Loading text
    ctx.font = '20px Arial';
    ctx.fillText(`Loading... ${Math.floor(config.loadingProgress)}%`, config.width/2, config.height/2 + 60);
    
    // Help message
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    if (config.loadingProgress < 100) {
        // Drawing an instructional message about images
        ctx.fillText("To add your own images:", config.width/2, config.height/2 + 100);
        ctx.fillText("1. Create an 'images' folder", config.width/2, config.height/2 + 125);
        ctx.fillText("2. Add your images to the folder", config.width/2, config.height/2 + 150);
        ctx.fillText("3. Edit gameImages at the top of bella-quest.js", config.width/2, config.height/2 + 175);
    } else {
        ctx.fillText("Creating a special journey filled with memories...", config.width/2, config.height/2 + 100);
    }
    
    // When loading is complete
    if (config.loadingProgress >= 100 && !config.loadingComplete) {
        config.loadingComplete = true;
        setTimeout(() => {
            gameState.showLoading = false;
            gameState.showIntro = true;
        }, 1000);
    }
}

// Intro screen with a meaningful message
function drawIntroScreen() {
    const ctx = config.ctx;
    
    // Simple gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#4a5568');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Title
    ctx.fillStyle = '#fff';
    ctx.font = '46px Poppins, Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Bella's Quest", config.width/2, 100);
    
    ctx.font = '24px Poppins, Arial';
    ctx.fillText("A Journey Through Memories", config.width/2, 150);
    
    // Message
    ctx.font = '18px Poppins, Arial';
    const message = messages.intro;
    ctx.fillText(message, config.width/2, 220);
    
    // Heartfelt message
    ctx.fillStyle = '#f06292';
    const heartMsg = heartfeltMessages[0];
    wrapText(ctx, heartMsg, config.width/2, 280, 600, 30);
    
    // Draw Bella
    drawBella(ctx, config.width/2 - 25, 350, 1.2);
    
    // Instructions
    ctx.fillStyle = '#fff';
    ctx.font = '20px Poppins, Arial';
    ctx.fillText("Controls:", config.width/2, 450);
    ctx.font = '16px Poppins, Arial';
    ctx.fillText("← → Arrow Keys to move", config.width/2, 480);
    ctx.fillText("↑ or Space to jump", config.width/2, 510);
    
    // Start button
    drawButton(ctx, "Start Journey", config.width/2 - 100, 550, 200, 50, "#f06292");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    
    ctx.fillText(line, x, y);
    return y;
}

function drawButton(ctx, text, x, y, width, height, color) {
    // Button background
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(x, y, width, height);
    
    // Button text
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width/2, y + height/2);
    
    // Reset
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

// Load game images with better error handling
function loadGameImages() {
    // CUSTOMIZE YOUR IMAGE PATHS HERE
    // By default, images should be in an "images" folder
    // You can change the path if your images are stored elsewhere
    const imagePath = 'images/';
    
    // List of images to load - only include the ones we have
    const imageList = [
        { name: 'bella_sprite', path: imagePath + gameImages.bella },
        { name: 'tampa_background', path: imagePath + gameImages.tampaBg },
        { name: 'sdsu_background', path: imagePath + gameImages.sdsuBg },
        { name: 'pb_background', path: imagePath + gameImages.pbBg }
        // We don't have these images, so don't try to load them
        // { name: 'heart', path: imagePath + gameImages.heart },
        // { name: 'memory_photo', path: imagePath + gameImages.memoryPhoto },
        // { name: 'trophy', path: imagePath + gameImages.trophy }
    ];
    
    // Setup loading stats
    config.totalAssets = imageList.length;
    config.loadedAssets = 0;
    
    // Just force the loading progress to complete quickly
    config.loadingProgress = 100;
    config.loadingComplete = true;
    
    // Mark loading as complete
    setTimeout(() => {
        gameState.showLoading = false;
        gameState.showIntro = true;
    }, 500);
    
    // Load each image
    imageList.forEach(image => {
        const img = new Image();
        img.src = image.path;
        config.sprites[image.name] = img;
        
        // Log image loading for debugging
        console.log(`Loading image: ${image.name} from ${image.path}`);
        
        img.onload = () => {
            console.log(`Successfully loaded: ${image.name}`);
        };
        
        img.onerror = () => {
            console.log(`Failed to load: ${image.name} from ${image.path}`);
        };
    });
}

// Update game objects
function updateGame() {
    // Update message timer if showing a message
    if (gameState.showMessage) {
        gameState.messageTimer--;
        if (gameState.messageTimer <= 0) {
            gameState.showMessage = false;
        }
    }
    
    player.update();
    updateObstacles();
    checkCollisions();
}

// Update obstacles
function updateObstacles() {
    const currentLevel = levels[gameState.currentLevel];
    
    for (const obstacle of currentLevel.obstacles) {
        // Move obstacle
        obstacle.x += obstacle.direction * obstacle.speed;
        
        // Reverse direction at screen edges
        if (obstacle.x <= 0 || obstacle.x + obstacle.width >= config.width) {
            obstacle.direction *= -1;
        }
        
        // Special movements based on type
        if (obstacle.type === 'wave') {
            obstacle.y = obstacle.baseY + Math.sin(Date.now() / 500) * 20;
        } else if (obstacle.type === 'flying') {
            // Make flying obstacles move up and down more dramatically
            obstacle.y = obstacle.baseY + Math.sin(Date.now() / 300) * 40;
        }
    }
}

// Check collisions with obstacles and collectibles
function checkCollisions() {
    const currentLevel = levels[gameState.currentLevel];
    
    // Check memory photo collision first - most important
    if (currentLevel.memoryPhoto && !currentLevel.memoryPhoto.collected &&
        player.x < currentLevel.memoryPhoto.x + currentLevel.memoryPhoto.width &&
        player.x + player.width > currentLevel.memoryPhoto.x &&
        player.y < currentLevel.memoryPhoto.y + currentLevel.memoryPhoto.height &&
        player.y + player.height > currentLevel.memoryPhoto.y) {
        
        console.log("Collected memory photo in level: " + currentLevel.name);
        currentLevel.memoryPhoto.collected = true;
        gameState.score += 500;
        
        // Show the memory photo message
        showMessage(currentLevel.memoryPhoto.message);
        
        // Check if this is the final level (pb)
        if (currentLevel.name === 'pb') {
            console.log("Final level complete! Starting ending sequence soon...");
            // Directly trigger the ending sequence after a short delay
            setTimeout(() => {
                directlyStartEnding();
            }, 2000);
            return;
        }
        
        // Otherwise add the normal level completion message and flag
        setTimeout(() => {
            showMessage("Level complete! Press SPACE to continue to the next level.");
            gameState.levelComplete = true;
        }, 3000);
        
        return; // Skip other collision checks
    }
    
    // Check obstacle collisions with variable damage
    for (const obstacle of currentLevel.obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            
            // Apply the specific damage for this obstacle type
            const damage = obstacle.damage || 25; // Default to 25 if not specified
            gameState.health = Math.max(0, gameState.health - damage);
            
            // Bounce the player back and give better feedback
            player.velocityY = config.jumpForce * 0.7;
            player.velocityX = (player.x < obstacle.x) ? -5 : 5; // Push player away from obstacle
            
            // Visual feedback with health percentage and damage amount
            showMessage(`Ouch! -${damage}% damage! Health: ${gameState.health}%`);
            
            // Only end game if health is completely gone
            if (gameState.health <= 0) {
                gameOver(false);
            }
            
            // Give the player brief invincibility (move the obstacle away)
            obstacle.x += (player.x < obstacle.x) ? 50 : -50;
            
            return; // Skip collectible checks
        }
    }
    
    // Check collectible collisions
    for (const collectible of currentLevel.collectibles) {
        if (!collectible.collected &&
            player.x < collectible.x + collectible.width &&
            player.x + player.width > collectible.x &&
            player.y < collectible.y + collectible.height &&
            player.y + player.height > collectible.y) {
            
            collectible.collected = true;
            
            if (collectible.type === 'health') {
                // Increase health restoration to make game easier
                gameState.health = Math.min(100, gameState.health + 25); // Changed from 20 to 25
                showMessage(`Health restored to ${gameState.health}%!`);
            } else {
                gameState.score += 100;
                if (collectible.message) {
                    showMessage(collectible.message);
                }
            }
            
            // Important - We don't return here anymore, continue game flow
            // This prevents the bug where collecting a regular item was
            // restarting/freezing the level
        }
    }
}

// Draw game
function drawGame() {
    const ctx = config.ctx;
    const currentLevel = levels[gameState.currentLevel];
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw background - match image names to the actual files
    let bgImage;
    if (currentLevel.name === 'tampa') {
        bgImage = config.sprites.tampa_background;
    } else if (currentLevel.name === 'sdsu') {
        bgImage = config.sprites.sdsu_background;
    } else if (currentLevel.name === 'pb') {
        bgImage = config.sprites.pb_background;
    }
    
    if (bgImage && bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, config.width, config.height);
    } else {
        // Fallback gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
        if (currentLevel.name === 'tampa') {
            gradient.addColorStop(0, "#ffafbd");
            gradient.addColorStop(1, "#ffc3a0");
        } else if (currentLevel.name === 'sdsu') {
            gradient.addColorStop(0, "#2193b0");
            gradient.addColorStop(1, "#6dd5ed");
        } else if (currentLevel.name === 'pb') {
            gradient.addColorStop(0, "#4facfe");
            gradient.addColorStop(1, "#00f2fe");
        } else {
            // Default gradient for any other case
            gradient.addColorStop(0, "#a1c4fd");
            gradient.addColorStop(1, "#c2e9fb");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, config.width, config.height);
    }
    
    // Draw platforms
    for (const platform of currentLevel.platforms) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw memory photo if not collected
    if (currentLevel.memoryPhoto && !currentLevel.memoryPhoto.collected) {
        if (config.sprites.memory_photo && config.sprites.memory_photo.complete) {
            ctx.drawImage(config.sprites.memory_photo, 
                        currentLevel.memoryPhoto.x, 
                        currentLevel.memoryPhoto.y, 
                        currentLevel.memoryPhoto.width, 
                        currentLevel.memoryPhoto.height);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(currentLevel.memoryPhoto.x, 
                        currentLevel.memoryPhoto.y, 
                        currentLevel.memoryPhoto.width, 
                        currentLevel.memoryPhoto.height);
        }
        
        // Draw a simple text indicator
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Collect!', 
                   currentLevel.memoryPhoto.x + currentLevel.memoryPhoto.width/2,
                   currentLevel.memoryPhoto.y - 5);
        ctx.textAlign = 'left';
    }
    
    // Draw obstacles with their specific colors
    for (const obstacle of currentLevel.obstacles) {
        ctx.fillStyle = obstacle.color || '#FF0000'; // Use the obstacle's color or default to red
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Add an indicator for damage amount
        if (obstacle.damage) {
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${obstacle.damage}%`, 
                      obstacle.x + obstacle.width/2, 
                      obstacle.y + obstacle.height/2 + 3);
            ctx.textAlign = 'left';
        }
    }
    
    // Draw collectibles
    for (const collectible of currentLevel.collectibles) {
        if (!collectible.collected) {
            if (collectible.type === 'health') {
                if (config.sprites.heart && config.sprites.heart.complete) {
                    ctx.drawImage(config.sprites.heart, 
                                collectible.x, collectible.y, 
                                collectible.width, collectible.height);
                } else {
                    ctx.fillStyle = '#FF69B4';
                    ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
                }
            } else {
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
            }
        }
    }
    
    // Draw player
    if (config.sprites.bella_sprite && config.sprites.bella_sprite.complete) {
        ctx.drawImage(config.sprites.bella_sprite, 
                    player.x, player.y, 
                    player.width, player.height);
    } else {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    
    // Draw UI
    drawSimpleUI();
    
    // Draw any active message
    if (gameState.showMessage) {
        drawSimpleMessage(gameState.currentMessage);
    }
}

// Draw a simplified UI
function drawSimpleUI() {
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

// Draw a simplified message
function drawSimpleMessage(text) {
    const ctx = config.ctx;
    
    // Message box background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(100, config.height - 150, config.width - 200, 120);
    
    // Message text
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    wrapText(ctx, text, config.width/2, config.height - 120, config.width - 250, 30);
    ctx.textAlign = 'left';
    
    // Instruction
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to continue', config.width/2, config.height - 50);
    ctx.textAlign = 'left';
}

// Game over
function gameOver(victory) {
    console.log("Game over called with victory:", victory);
    gameState.gameStarted = false;
    
    // Only draw the end screen if we're not in the cinematic ending
    if (!gameState.showingCinematicEnding) {
        // Draw game over screen immediately
        const ctx = config.ctx;
        
        // Draw overlay
        ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
        ctx.fillRect(0, 0, config.width, config.height);
        
        // Draw end screen
        drawEndScreen(ctx, victory, 0.8);
    }
}

// Draw end screen
function drawEndScreen(ctx, victory, alpha) {
    // Title
    ctx.globalAlpha = Math.min(1, alpha + 0.2);
    ctx.fillStyle = victory ? '#FFD700' : 'white';
    ctx.font = '48px Poppins, Arial';
    ctx.textAlign = 'center';
    
    if (victory) {
        ctx.fillText('Journey Complete!', config.width/2, 100);
        
        // Show the star in the middle similar to screenshot
        drawStar(ctx, config.width/2, 200, 5, 60, 30);
        
        // Skip the pink heartfelt messages, they've already been shown in the cinematic ending
        
        // Victory message
        ctx.fillStyle = 'white';
        ctx.font = '24px Poppins, Arial';
        let y = 280; // Starting y position after removing text
        y = wrapText(ctx, messages.victory, config.width/2, y, 600, 35);
        
        // Score display
        ctx.fillStyle = 'white';
        ctx.font = '24px Poppins, Arial';
        ctx.fillText(`Total Score: ${gameState.score}`, config.width/2, y + 30);
        
        // Replay option with animation
        const time = Date.now() / 500;
        const bounce = Math.sin(time) * 3;
        ctx.font = '20px Poppins, Arial';
        ctx.fillText('Press R to play again and relive the memories', config.width/2, y + 70 + bounce);
        
        // Draw a replay button
        const buttonX = config.width/2 - 100;
        const buttonY = y + 100;
        ctx.fillStyle = '#f06292';
        ctx.fillRect(buttonX, buttonY, 200, 50);
        
        // Button text
        ctx.fillStyle = 'white';
        ctx.font = '18px Poppins, Arial';
        ctx.fillText('Restart Game', config.width/2, buttonY + 30);
        
        // Add click handler for restart button
        config.canvas.addEventListener('click', function restartClick(e) {
            const rect = config.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (mouseX >= buttonX && mouseX <= buttonX + 200 &&
                mouseY >= buttonY && mouseY <= buttonY + 50) {
                resetGame();
                config.canvas.removeEventListener('click', restartClick);
            }
        });
    } else {
        ctx.fillText('Bella needs a rest!', config.width/2, 150);
        
        // Game over message
        ctx.fillStyle = 'white';
        ctx.font = '24px Poppins, Arial';
        ctx.fillText('But every setback is just a chance to try again.', config.width/2, 220);
        ctx.fillText('Just like real relationships!', config.width/2, 260);
        
        // Restart prompt with animation
        const time = Date.now() / 500;
        const bounce = Math.sin(time) * 3;
        ctx.fillStyle = '#FF69B4';
        ctx.font = '28px Poppins, Arial';
        ctx.fillText('Press R to continue the journey', config.width/2, 350 + bounce);
        
        // Draw a restart button
        const buttonX = config.width/2 - 100;
        const buttonY = 380;
        ctx.fillStyle = '#f06292';
        ctx.fillRect(buttonX, buttonY, 200, 50);
        
        // Button text
        ctx.fillStyle = 'white';
        ctx.font = '18px Poppins, Arial';
        ctx.fillText('Try Again', config.width/2, buttonY + 30);
        
        // Add click handler for restart button
        config.canvas.addEventListener('click', function restartClick(e) {
            const rect = config.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (mouseX >= buttonX && mouseX <= buttonX + 200 &&
                mouseY >= buttonY && mouseY <= buttonY + 50) {
                resetGame();
                config.canvas.removeEventListener('click', restartClick);
            }
        });
    }
    
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1.0;
}

// Draw a star for the trophy
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // Add shine to the trophy
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(cx - outerRadius/3, cy - outerRadius/3, outerRadius/5, 0, Math.PI * 2);
    ctx.fill();
}

// Game loop - super simplified to prevent freezing
function gameLoop() {
    if (gameState.showLoading) {
        drawLoadingScreen();
    } else if (gameState.showIntro) {
        drawIntroScreen();
    } else if (gameState.showingCinematicEnding) {
        // The animation is now handled by the animateCinematicEnding function directly
        // No need to call it here
    } else if (gameState.gameStarted) {
        updateGame();
        drawGame();
    }
    
    requestAnimationFrame(gameLoop);
}

// Handle canvas clicks for buttons - simplified
function handleCanvasClick(e) {
    const rect = config.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gameState.showIntro) {
        // Check if Start button was clicked
        if (x >= config.width/2 - 100 && x <= config.width/2 + 100 &&
            y >= 540 && y <= 600) {
            gameState.showIntro = false;
            resetGame();
            
            // Hide the UI overlay
            if (window.hideUIOverlay) {
                window.hideUIOverlay();
            }
            
            // Force a small delay to ensure game is initialized properly
            setTimeout(() => {
                showMessage(messages[levels[gameState.currentLevel].name]);
            }, 100);
        }
    }
}

// Set up control handlers
function setupControls() {
    // Keyboard controls - keydown
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
                
                // Progress to next level if level is complete
                if (gameState.levelComplete) {
                    advanceToNextLevel();
                    return;
                }
                
                // Dismiss message if showing
                if (gameState.showMessage) {
                    gameState.showMessage = false;
                }
                break;
            case 'r':
            case 'R':
                // Always allow reset
                resetGame();
                break;
        }
    });
    
    // Keyboard controls - keyup
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
}

// Reset game - also needs to hide UI in case this is called from the button
function resetGame() {
    gameState.score = 0;
    gameState.health = 100;
    gameState.currentLevel = 0;
    gameState.gameStarted = true;
    gameState.showIntro = false;
    gameState.levelComplete = false;
    
    player.x = 50;
    player.y = 450;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    
    // Hide the UI overlay
    if (window.hideUIOverlay) {
        window.hideUIOverlay();
    }
    
    // Reset collectibles and memory photos - use faster looping
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        
        // Reset collectibles
        for (let j = 0; j < level.collectibles.length; j++) {
            level.collectibles[j].collected = false;
        }
        
        // Reset memory photo
        if (level.memoryPhoto) {
            level.memoryPhoto.collected = false;
        }
    }
}

// Show a message popup
function showMessage(text) {
    // Clear any existing message timers
    if (gameState.messageTimerId) {
        clearTimeout(gameState.messageTimerId);
    }
    
    gameState.showMessage = true;
    gameState.currentMessage = text;
    gameState.messageTimer = 150; // Show for 150 frames (about 2.5 seconds)
    
    // Auto-hide message after a delay
    gameState.messageTimerId = setTimeout(() => {
        gameState.showMessage = false;
    }, 2500);
}

// Start game when page loads
window.onload = function() {
    try {
        initGame();
    } catch (e) {
        // Display an error message on the page
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.style.margin = '20px';
        errorDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        errorDiv.style.borderRadius = '10px';
        errorDiv.innerHTML = `<h2>Error Starting Game</h2><p>Please refresh the page to try again.</p>`;
        document.body.appendChild(errorDiv);
    }
};

// Draw Bella
function drawBella(ctx, x, y, scale = 1) {
    const width = 50 * scale;
    const height = 50 * scale;
    
    if (config.sprites.bella_sprite && config.sprites.bella_sprite.complete) {
        ctx.drawImage(config.sprites.bella_sprite, x, y, width, height);
    } else {
        // Draw a cute dog shape
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, width, height);
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + 15 * scale, y + 15 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.arc(x + 35 * scale, y + 15 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        const pupilX = player.facing === 'right' ? 2 : -2;
        ctx.arc(x + 15 * scale + pupilX * scale, y + 15 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.arc(x + 35 * scale + pupilX * scale, y + 15 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x + 25 * scale, y + 30 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth - happy expression
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(x + 25 * scale, y + 35 * scale, 10 * scale, 0, Math.PI);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
}

// Add touch controls for mobile devices
function setupTouchControls() {
    // Create touch areas
    const touchContainer = document.createElement('div');
    touchContainer.style.position = 'absolute';
    touchContainer.style.bottom = '0';
    touchContainer.style.left = '0';
    touchContainer.style.width = '100%';
    touchContainer.style.height = '100px';
    touchContainer.style.display = 'flex';
    touchContainer.style.justifyContent = 'space-between';
    touchContainer.style.pointerEvents = 'none';
    
    // Left touch area
    const leftTouch = document.createElement('div');
    leftTouch.style.width = '33%';
    leftTouch.style.height = '100%';
    leftTouch.style.pointerEvents = 'auto';
    
    // Right touch area
    const rightTouch = document.createElement('div');
    rightTouch.style.width = '33%';
    rightTouch.style.height = '100%';
    rightTouch.style.pointerEvents = 'auto';
    
    // Jump touch area
    const jumpTouch = document.createElement('div');
    jumpTouch.style.width = '34%';
    jumpTouch.style.height = '100%';
    jumpTouch.style.pointerEvents = 'auto';
    
    // Add to container
    touchContainer.appendChild(leftTouch);
    touchContainer.appendChild(jumpTouch);
    touchContainer.appendChild(rightTouch);
    
    // Add to document
    document.body.appendChild(touchContainer);
    
    // Left touch handlers
    leftTouch.addEventListener('touchstart', function(e) {
        e.preventDefault();
        config.keys.left = true;
    });
    
    leftTouch.addEventListener('touchend', function(e) {
        e.preventDefault();
        config.keys.left = false;
    });
    
    // Right touch handlers
    rightTouch.addEventListener('touchstart', function(e) {
        e.preventDefault();
        config.keys.right = true;
    });
    
    rightTouch.addEventListener('touchend', function(e) {
        e.preventDefault();
        config.keys.right = false;
    });
    
    // Jump touch handlers
    jumpTouch.addEventListener('touchstart', function(e) {
        e.preventDefault();
        config.keys.up = true;
    });
    
    jumpTouch.addEventListener('touchend', function(e) {
        e.preventDefault();
        config.keys.up = false;
    });
}

// Create a new cinematic ending sequence
function startCinematicEnding() {
    console.log("Starting cinematic ending sequence");
    gameState.gameStarted = false;
    gameState.showingCinematicEnding = true;
    gameState.cinematicStep = 0;
    gameState.cinematicFade = 0;
    gameState.cinematicMessages = [
        "Josephina, you are amazingly perfect and awesome.",
        "You've made my life so much better in every way possible.",
        "I'm so excited for our future together.",
        "I've seriously never felt like this before.",
        "I feel so connected to you and I fall more in love with you every day.",
        "Thank you for being you.",
        "Journey Complete!"
    ];
    
    // Add a short delay before starting animation to ensure clean transition
    setTimeout(() => {
        // Start the cinematic sequence animation
        animateCinematicEnding();
    }, 50);
}

function animateCinematicEnding() {
    console.log("Animation frame");
    
    // Safety check
    if (!gameState.showingCinematicEnding) {
        console.log("Animation stopped: not in cinematic mode");
        return;
    }
    
    // Get context
    const ctx = config.ctx;
    if (!ctx) {
        console.log("No context available");
        return;
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw a dark background like in the screenshot
    ctx.fillStyle = '#2A1E1E';
    ctx.fillRect(0, 0, config.width, config.height);
    
    // Draw sparkles/particles
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * config.width;
        const y = Math.random() * config.height;
        const size = Math.random() * 4 + 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw star/trophy in the middle like in the screenshot
    drawStar(ctx, config.width/2, 200, 5, 60, 30);
    
    // Draw current message with fade effect - SLOW DOWN THE SPEED
    if (gameState.cinematicStep < gameState.cinematicMessages.length) {
        // Increase fade value - SLOW DOWN by reducing the increment value
        gameState.cinematicFade += 0.006; // Much slower transition (was 0.01)
        
        // If fully displayed, move to next message
        if (gameState.cinematicFade >= 2.5) { // Increased display time (was 1.5)
            gameState.cinematicStep++;
            gameState.cinematicFade = 0;
            
            // If all messages have been shown, go to victory screen
            if (gameState.cinematicStep >= gameState.cinematicMessages.length) {
                gameState.showingCinematicEnding = false;
                gameOver(true);
                return;
            }
        }
        
        // Calculate fade effect
        let alpha = 1.0;
        if (gameState.cinematicFade < 0.3) { // Slower fade in (was 0.2)
            alpha = gameState.cinematicFade / 0.3;
        } else if (gameState.cinematicFade > 2.2) { // Slower fade out (was 1.3)
            alpha = 1 - ((gameState.cinematicFade - 2.2) / 0.3);
        }
        
        // Draw message
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FF69B4'; // Pink color as shown in screenshot
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        
        // Gold color for final message
        if (gameState.cinematicStep === gameState.cinematicMessages.length - 1) {
            ctx.font = '48px Arial';
            ctx.fillStyle = '#FFD700';
        }
        
        // Draw the text
        const msg = gameState.cinematicMessages[gameState.cinematicStep];
        wrapText(ctx, msg, config.width/2, config.height/2 + 50, 600, 40);
        
        // Reset drawing settings
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
    
    // Continue animation
    if (gameState.showingCinematicEnding) {
        requestAnimationFrame(animateCinematicEnding);
    }
}

// New function to handle advancing to the next level
function advanceToNextLevel() {
    // Reset the level complete flag
    gameState.levelComplete = false;
    
    if (gameState.currentLevel < levels.length - 1) {
        console.log("Moving to next level: " + (gameState.currentLevel + 1));
        // Update the game state
        gameState.currentLevel++;
        
        // Reset player position for next level - use a safe starting position
        if (gameState.currentLevel === 1) { // SDSU level
            // Place player on the leftmost platform, safely away from obstacles
            player.x = 20;
            player.y = 450;
        } else {
            // Default position for other levels
            player.x = 50;
            player.y = 450;
        }
        
        player.velocityX = 0;
        player.velocityY = 0;
        
        // Show the level message
        const newLevelName = levels[gameState.currentLevel].name;
        showMessage(messages[newLevelName]);
        console.log("Now on level: " + newLevelName);
    } else {
        console.log("Reached final level, starting cinematic ending");
        // Start the cinematic ending sequence directly
        directlyStartEnding();
    }
}

// New function to directly start the ending, bypassing any possible issues
function directlyStartEnding() {
    console.log("Directly starting cinematic ending");
    
    // Force reset all game states to ensure clean transition
    gameState.gameStarted = false;
    gameState.showIntro = false;
    gameState.showLoading = false;
    gameState.showingCinematicEnding = true;
    gameState.levelComplete = false;
    gameState.cinematicStep = 0;
    gameState.cinematicFade = 0;
    
    // Define the cinematic messages
    gameState.cinematicMessages = [
        "Josephina, you are amazingly perfect and awesome.",
        "You've made my life so much better in every way possible.",
        "I'm so excited for our future together.",
        "I've seriously never felt like this before.",
        "I feel so connected to you and I fall more in love with you every day.",
        "Thank you for being you.",
        "Journey Complete!"
    ];
    
    // Force update drawing
    if (config.ctx) {
        // Clear screen
        config.ctx.clearRect(0, 0, config.width, config.height);
        
        // Draw a simple loading message
        config.ctx.fillStyle = 'black';
        config.ctx.fillRect(0, 0, config.width, config.height);
        config.ctx.fillStyle = 'white';
        config.ctx.font = '24px Arial';
        config.ctx.textAlign = 'center';
        config.ctx.fillText("Loading the ending...", config.width/2, config.height/2);
    }
    
    // Start animation with delay to ensure clean transition
    setTimeout(() => {
        console.log("Starting animation");
        animateCinematicEnding();
    }, 100);
} 