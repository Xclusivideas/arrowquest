
// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas sizing with proper initial dimensions
function resizeCanvas() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    canvas.width = Math.min(800, containerWidth - 20); // 10px padding on each side
    canvas.height = canvas.width * 0.75; // Keep 4:3 aspect ratio
    
    // Update display heights based on new canvas height
    document.getElementById('arrows-display').style.height = canvas.height + 'px';
    document.getElementById('apples-display').style.height = canvas.height + 'px';
    
    // Reinitialize game if it was already started
    if (gameStarted) {
        initGame();
    }
}

// Set initial size immediately and again when fully loaded
window.addEventListener('DOMContentLoaded', resizeCanvas); // Apply sizing on DOM load
window.addEventListener('load', resizeCanvas); // And again on full load
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
    ArrowRight: false
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
