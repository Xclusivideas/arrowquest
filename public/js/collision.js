
// Collision detection and handling

// Check collision between arrow and object
function checkCollision(arrow, obj) {
    const dx = (arrow.x + arrow.width/2) - obj.x;
    const dy = arrow.y - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj.size/2 + 5;
}

// Process collisions between arrows and fruits
function processArrowFruitCollisions() {
    // Check for collision with arrows
    for (let i = fruits.length - 1; i >= 0; i--) {
        if (fruits[i].attachedArrow) continue; // Skip already attached fruits
        
        for (let j = arrows.length - 1; j >= 0; j--) {
            if (checkCollision(arrows[j], fruits[i])) {
                // Fruit hit by arrow
                fruits[i].attachToArrow(arrows[j]);
                
                // Play fruit hit sound
                playSound('fruitHit');
                
                // Update combo
                hitCombo++;
                lastHitTime = performance.now();
                
                // Calculate score based on height, fruit type, and combo
                let heightBonus = (canvas.height - fruits[i].y) / canvas.height * 2 + 1;
                let comboMultiplier = 1 + (hitCombo - 1) * 0.5; // 1x, 1.5x, 2x, 2.5x, etc.
                let scoreValue = fruits[i].points * heightBonus * comboMultiplier;
                
                // Add floating score text
                addScorePopup(fruits[i].x, fruits[i].y, Math.floor(scoreValue), hitCombo);
                
                // Play score sound
                playSound('score');
                
                // Update score
                score += Math.floor(scoreValue);
                updateScoreDisplay();
                
                // Add to speared apples
                spearApples.push({
                    type: fruits[i].type,
                    color: fruits[i].color
                });
                updateApplesDisplay();
                
                break;
            }
        }
    }
}

// Process collisions between arrows and bombs
function processArrowBombCollisions() {
    for (let i = bombs.length - 1; i >= 0; i--) {
        for (let j = arrows.length - 1; j >= 0; j--) {
            if (checkCollision(arrows[j], bombs[i])) {
                // Bomb hit by arrow - process explosion
                createExplosion(bombs[i].x, bombs[i].y);
                
                // Play explosion sound
                playSound('explosion');
                
                // Set bomb explosion in progress
                bombExplosionInProgress = true;
                
                // Remove the bomb and arrow
                bombs.splice(i, 1);
                arrows.splice(j, 1);
                
                // Wait for explosion animation to complete before ending game
                setTimeout(() => {
                    if (!gameOver) {
                        endGame();
                    }
                    bombExplosionInProgress = false;
                }, 1500);
                
                break;
            }
        }
    }
}

// Remove offscreen objects
function removeOffscreenObjects() {
    // Remove arrows that are off-screen
    for (let i = arrows.length - 1; i >= 0; i--) {
        if (arrows[i].x - arrows[i].width/2 > canvas.width) {
            arrows.splice(i, 1);
        }
    }
    
    // Remove fruits that have fallen off-screen
    for (let i = fruits.length - 1; i >= 0; i--) {
        if (fruits[i].y > canvas.height && !fruits[i].attachedArrow) {
            // Count dropped apple
            applesDropped++;
            
            // Check if game over
            if (applesDropped >= 20) {
                endGame();
            }
            
            fruits.splice(i, 1);
        }
    }
    
    // Remove bombs that have fallen off-screen
    for (let i = bombs.length - 1; i >= 0; i--) {
        if (bombs[i].y > canvas.height) {
            bombs.splice(i, 1);
        }
    }
}
