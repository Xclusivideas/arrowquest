
// Game objects

// Create archer object
function createArcher() {
    return {
        x: 50,
        y: canvas.height / 2,
        size: 40,
        update: function() {
            // Follow mouse Y position
            this.y = mouseY;
            if (this.y < this.size/2) this.y = this.size/2;
            if (this.y > canvas.height - this.size/2) this.y = canvas.height - this.size/2;
        },
        draw: function() {
            // Draw cartoon archer body
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Draw body
            ctx.fillStyle = '#8B4513'; // Brown
            ctx.fillRect(-5, -20, 10, 40); // Torso
            
            // Draw head
            ctx.fillStyle = '#FFA07A'; // Light salmon
            ctx.beginPath();
            ctx.arc(0, -30, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(5, -33, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(5, -33, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw hat
            ctx.fillStyle = '#228B22'; // Forest green
            ctx.beginPath();
            ctx.moveTo(-15, -35);
            ctx.lineTo(15, -35);
            ctx.lineTo(0, -55);
            ctx.closePath();
            ctx.fill();
            
            // Draw arms
            ctx.fillStyle = '#FFA07A'; // Light salmon
            ctx.fillRect(5, -15, 20, 8); // Right arm
            
            // Draw bow
            ctx.strokeStyle = '#8B4513'; // Brown
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(25, -10, 20, -Math.PI/2.5, Math.PI/2.5);
            ctx.stroke();
            
            // Draw bowstring
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(25 + Math.cos(-Math.PI/2.5) * 20, -10 + Math.sin(-Math.PI/2.5) * 20);
            ctx.lineTo(25 + Math.cos(Math.PI/2.5) * 20, -10 + Math.sin(Math.PI/2.5) * 20);
            ctx.stroke();
            
            ctx.restore();
        }
    };
}

// Create arrow object
function createArrow(x, y) {
    // Play arrow shoot sound
    playSound('arrowShoot');
    
    return {
        x: x,
        y: y,
        width: 40,
        height: 5,
        speed: 10,
        fruits: [],
        update: function() {
            this.x += this.speed;
            
            // Update attached fruits
            for (let fruit of this.fruits) {
                fruit.x = this.x + 5; // Offset slightly to prevent stacking
                fruit.y = this.y;
            }
        },
        draw: function() {
            // Draw arrow shaft with neon effect
            ctx.strokeStyle = '#ffcc00'; // Yellow
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 5;
            ctx.lineWidth = this.height;
            ctx.beginPath();
            ctx.moveTo(this.x - this.width/2, this.y);
            ctx.lineTo(this.x + this.width/2, this.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw arrow head
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, this.y);
            ctx.lineTo(this.x + this.width/2 - 10, this.y - 10);
            ctx.lineTo(this.x + this.width/2 - 10, this.y + 10);
            ctx.closePath();
            ctx.fill();
            
            // Draw arrow feathers
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.ellipse(this.x - this.width/2 + 5, this.y - 8, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x - this.width/2 + 5, this.y + 8, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw trail effect
            for (let i = 1; i <= 5; i++) {
                ctx.strokeStyle = `rgba(255, 204, 0, ${0.2 - i * 0.03})`;
                ctx.lineWidth = this.height - i * 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x - this.width/2 - i * 8, this.y);
                ctx.lineTo(this.x - this.width/2, this.y);
                ctx.stroke();
            }
        }
    };
}

// Create fruit object
function createFruit(x, y, type = "apple") {
    let size = type === "special" ? 40 : 30;
    let color, points;
    
    // Set color and points based on type
    if (type === "apple") {
        color = '#ff3333';
        points = 10;
    } else if (type === "pear") {
        color = '#B4D455'; // Yellow-green
        points = 20;
    } else if (type === "special") {
        color = '#ffdd00';
        points = 50;
    }
    
    return {
        x: x,
        y: y,
        size: size,
        type: type,
        color: color,
        points: points,
        speed: (1 + Math.random() * 2) * fruitSpeed,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
        attachedArrow: null,
        update: function() {
            if (!this.attachedArrow) {
                this.y += this.speed;
                this.angle += this.rotationSpeed;
            }
        },
        draw: function() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            // Draw fruit with neon glow
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            
            if (this.type === "apple") {
                // Draw apple
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw stem
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(0, -this.size/2 - 8);
                ctx.stroke();
                
                // Draw leaf
                ctx.fillStyle = '#00cc00';
                ctx.beginPath();
                ctx.ellipse(4, -this.size/2 - 4, 4, 2.5, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === "pear") {
                // Draw pear shape
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(0, -this.size * 0.4, this.size * 0.25, this.size * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw stem
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -this.size * 0.6);
                ctx.lineTo(0, -this.size * 0.6 - 6);
                ctx.stroke();
            } else if (this.type === "special") {
                // Draw star shape
                ctx.beginPath();
                const spikes = 5;
                const outerRadius = this.size / 2;
                const innerRadius = this.size / 4;
                
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI * 2 * i) / (spikes * 2);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                ctx.closePath();
                ctx.fill();
                
                // Add sparkle
                ctx.shadowBlur = 0;
                if (Math.random() > 0.5) {
                    ctx.fillStyle = 'white';
                    const sparkleAngle = Math.random() * Math.PI * 2;
                    const sparkleRadius = Math.random() * (outerRadius * 0.7);
                    ctx.beginPath();
                    ctx.arc(
                        Math.cos(sparkleAngle) * sparkleRadius,
                        Math.sin(sparkleAngle) * sparkleRadius,
                        2, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
            
            ctx.restore();
            
            // Draw trail effect for spinning fruits
            if (!this.attachedArrow) {
                ctx.shadowBlur = 0;
                for (let i = 1; i <= 3; i++) {
                    const trailX = this.x - Math.sin(this.angle) * (i * 5);
                    const trailY = this.y - this.speed * i;
                    const trailSize = this.size - i * 5;
                    const trailAlpha = (100 - i * 30) / 255;
                    
                    ctx.fillStyle = `rgba(${this.type === 'apple' ? '255,51,51' : 
                                      this.type === 'pear' ? '180,212,85' : 
                                      '255,221,0'},${trailAlpha})`;
                    ctx.beginPath();
                    ctx.arc(trailX, trailY, trailSize/2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
        attachToArrow: function(arrow) {
            this.attachedArrow = arrow;
            arrow.fruits.push(this);
            this.rotationSpeed = 0; // Stop rotation when attached
        }
    };
}

// Create bomb object
function createBomb(x, y) {
    return {
        x: x,
        y: y,
        size: 35,
        speed: (2 + Math.random() * 2) * fruitSpeed,
        update: function() {
            this.y += this.speed;
        },
        draw: function() {
            // Draw bomb body with neon outline
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw bomb fuse
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            const fuseAngle = Math.PI/3;
            const fuseLength = 10;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size/2);
            ctx.lineTo(
                this.x + Math.cos(fuseAngle) * fuseLength,
                this.y - this.size/2 - Math.sin(fuseAngle) * fuseLength
            );
            ctx.stroke();
            
            // Draw fuse spark with animation - using timestamp instead of Date.now()
            if (Math.floor(performance.now() / 100) % 2 === 0) {
                ctx.fillStyle = '#ffff00';
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(
                    this.x + Math.cos(fuseAngle) * fuseLength,
                    this.y - this.size/2 - Math.sin(fuseAngle) * fuseLength,
                    3, 0, Math.PI * 2
                );
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    };
}

// Spawn new fruit or bomb
function spawnFruitOrBomb() {
    const x = canvas.width * 0.2 + Math.random() * (canvas.width * 0.6);
    const y = -20;
    
    if (Math.random() < 0.2) {
        // 20% chance to spawn a bomb
        bombs.push(createBomb(x, y));
    } else {
        // 80% chance to spawn a fruit
        const fruitType = Math.random();
        if (fruitType < 0.7) {
            // 70% chance for apple
            fruits.push(createFruit(x, y, "apple"));
        } else if (fruitType < 0.9) {
            // 20% chance for pear
            fruits.push(createFruit(x, y, "pear"));
        } else {
            // 10% chance for special fruit
            fruits.push(createFruit(x, y, "special"));
        }
    }
}
