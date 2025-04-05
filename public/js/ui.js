
// UI related functions

// Update score display
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
    
    // Flash score text for visual feedback
    document.getElementById('score').style.textShadow = '0 0 20px #ffff00';
    setTimeout(() => {
        document.getElementById('score').style.textShadow = '0 0 5px #ffff00';
    }, 200);
}

// Update time display
function updateTimeDisplay() {
    document.getElementById('time-left').textContent = timeLeft;
    
    // Flash time text when low
    if (timeLeft <= 10) {
        document.getElementById('time-left').style.color = timeLeft % 2 === 0 ? '#ff0000' : '#ffff00';
    }
}

// Update arrows display
function updateArrowsDisplay() {
    // Clear previous arrows
    const arrowsDisplay = document.getElementById('arrows-display');
    arrowsDisplay.innerHTML = '';
    
    // Add visual representation of arrows left
    for (let i = 0; i < arrowsLeft; i++) {
        const arrowIcon = document.createElement('div');
        arrowIcon.className = 'arrow-icon';
        arrowsDisplay.appendChild(arrowIcon);
    }
}

// Update apples display
function updateApplesDisplay() {
    // Clear previous apples
    const applesDisplay = document.getElementById('apples-display');
    applesDisplay.innerHTML = '';
    
    // Add visual representation of speared apples
    for (let i = 0; i < spearApples.length; i++) {
        const fruitIcon = document.createElement('div');
        if (spearApples[i].type === "apple") {
            fruitIcon.className = 'apple-icon';
            fruitIcon.style.backgroundColor = spearApples[i].color;
        } else if (spearApples[i].type === "pear") {
            fruitIcon.className = 'pear-icon';
        } else if (spearApples[i].type === "special") {
            fruitIcon.className = 'star-icon';
        }
        applesDisplay.appendChild(fruitIcon);
    }
}

// Update difficulty display
function updateDifficulty() {
    difficulty = parseInt(document.getElementById('difficulty').value);
    document.getElementById('difficulty-value').textContent = difficulty;
    
    // Update game parameters based on difficulty
    fruitSpawnRate = 0.01 + (difficulty - 1) * 0.004;
    fruitSpeed = 1 + (difficulty - 1) * 0.4;
    landscapeSpeed = 0.3 + (difficulty - 1) * 0.15; // Slower base speed
}

// Start game timer
function startGameTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Set up the new timer
    timerInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(timerInterval);
            return;
        }
        
        timeLeft--;
        updateTimeDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Add score popup
function addScorePopup(x, y, points, combo) {
    const text = combo > 1 ? `+${points} COMBO x${combo}!` : `+${points}`;
    const colors = ['#ffff00', '#ff00ff', '#00ffff', '#ff6600'];
    const color = colors[Math.min(combo, colors.length) - 1];
    
    scorePopups.push({
        x: x,
        y: y,
        text: text,
        vy: -2,
        size: 16 + Math.min(combo, 5) * 2,
        color: color,
        alpha: 1,
        decay: 0.02,
        update: function() {
            this.y += this.vy;
            this.alpha -= this.decay;
        },
        draw: function() {
            ctx.font = `bold ${this.size}px 'Arcade', monospace`;
            ctx.fillStyle = `rgba(${this.color === '#ffff00' ? '255,255,0' : 
                              this.color === '#ff00ff' ? '255,0,255' : 
                              this.color === '#00ffff' ? '0,255,255' : 
                              '255,102,0'},${this.alpha})`;
            ctx.strokeStyle = `rgba(0,0,0,${this.alpha})`;
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.strokeText(this.text, this.x, this.y);
            ctx.fillText(this.text, this.x, this.y);
            ctx.shadowBlur = 0;
        }
    });
}

// Show game over screen
function showGameOver() {
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
}

// Handle instructions modal
function setupInstructionsModal() {
    // Show instructions button
    document.getElementById('show-instructions').addEventListener('click', () => {
        document.getElementById('instructions-modal').classList.remove('hidden');
    });
    
    // Close instructions button
    document.getElementById('close-instructions').addEventListener('click', () => {
        document.getElementById('instructions-modal').classList.add('hidden');
    });
    
    // Close when clicking outside the modal content
    document.getElementById('instructions-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('instructions-modal')) {
            document.getElementById('instructions-modal').classList.add('hidden');
        }
    });
}

// Setup player name form
function setupPlayerForm() {
    document.getElementById('start-game-btn').addEventListener('click', () => {
        playerName = document.getElementById('player-name').value.trim();
        if (playerName === '') {
            playerName = 'Player' + Math.floor(Math.random() * 1000);
        }
        
        // Hide setup screen and show game screen
        document.getElementById('player-setup').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        
        // Start the game
        initGame();
    });
    
    // Also allow Enter key to start game
    document.getElementById('player-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('start-game-btn').click();
        }
    });
}

// Initialize UI
function initUI() {
    // Setup difficulty slider
    document.getElementById('difficulty').addEventListener('input', updateDifficulty);
    
    // Setup restart button
    document.getElementById('restart-button').addEventListener('click', () => {
        document.getElementById('game-over').classList.add('hidden');
        initGame();
    });
    
    // Setup toggle audio button (if present)
    const toggleAudioBtn = document.getElementById('toggle-audio');
    if (toggleAudioBtn) {
        toggleAudioBtn.addEventListener('click', function() {
            audioEnabled = !audioEnabled;
            this.textContent = audioEnabled ? "Disable Audio" : "Enable Audio";
            
            if (audioEnabled) {
                playSound('backgroundMusic');
            } else if (sounds.backgroundMusic) {
                sounds.backgroundMusic.pause();
            }
        });
    }
    
    // Setup instructions modal
    setupInstructionsModal();
    
    // Setup player form
    setupPlayerForm();
}
