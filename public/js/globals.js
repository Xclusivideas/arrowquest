
// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas sizing with proper initial dimensions
function resizeCanvas() {
    const container = document.getElementById('game-container');
    if (!container) return; // Safety check in case container is not loaded yet
    
    const containerWidth = container.clientWidth;
    canvas.width = Math.min(800, containerWidth - 20); // 10px padding on each side
    canvas.height = canvas.width * 0.75; // Keep 4:3 aspect ratio
    
    // Update display heights based on new canvas height
    const arrowsDisplay = document.getElementById('arrows-display');
    const applesDisplay = document.getElementById('apples-display');
    
    if (arrowsDisplay) arrowsDisplay.style.height = canvas.height + 'px';
    if (applesDisplay) applesDisplay.style.height = canvas.height + 'px';
    
    // Reinitialize game if it was already started
    if (gameStarted) {
        initGame();
    }
}

// Improved initialization to ensure container is fully rendered
function initializeCanvasSize() {
    // First attempt at initialization
    resizeCanvas();
    
    // Additional check after a longer delay to ensure container has proper dimensions
    setTimeout(() => {
        resizeCanvas();
        
        // Force another resize after a longer delay
        setTimeout(resizeCanvas, 300);
    }, 100);
}

// Set initial size with improved approach
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCanvasSize);
} else {
    initializeCanvasSize();
}

// And resize again on window load and resize
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Game state
let score = 0;
let arrowsLeft = 20;
let applesDropped = 0;
let gameOver = false;
let difficulty = 1; // Starting at 1
let fruitSpawnRate = 0.015;
let fruitSpeed = 1.5;
let landscapeSpeed = 0.3; // Slowed down
let hitCombo = 0;
let lastHitTime = 0;
let comboTimeout = 2000; // 2 seconds to maintain combo
let spearApples = []; // Apples that have been speared
let timeLeft = 60; // 60 seconds of game time
let timerInterval = null;
let gameStarted = false;
let playerName = '';
let bombExplosionInProgress = false;
let archerCanMove = true; // Allow archer to move around
let archerDirection = 'right'; // Default direction

// Game objects
let archer = null;
let arrows = [];
let fruits = [];
let bombs = [];
let particles = [];
let scorePopups = [];

// Background elements
let clouds = [];
let mountains = [];
let trees = [];
let wavePoints = [];
let stars = [];
let grassPatches = [];

// Mouse position
let mouseX = 0;
let mouseY = canvas.height / 2;

// Keyboard controls
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Enter: false
};

// Debug variables
let fpsValues = [];
let lastFrameTime = 0;
let audioEnabled = true;
let lastError = "None";
let frameCount = 0;
let lastFpsUpdate = 0;
let gameLoopRunning = false;

// Initialize leaderboard array
let leaderboard = [];

// For title animation
let titleAngle = 0;
