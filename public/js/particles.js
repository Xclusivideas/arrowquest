
// Particle effects

// Create explosion effect
function createExplosion(x, y) {
    // Create screen shake effect
    const originalX = canvas.style.left || '0px';
    const originalY = canvas.style.top || '0px';
    
    function shake() {
        const intensity = 10;
        const shakeX = (Math.random() - 0.5) * intensity;
        const shakeY = (Math.random() - 0.5) * intensity;
        canvas.style.position = 'relative';
        canvas.style.left = `${shakeX}px`;
        canvas.style.top = `${shakeY}px`;
    }
    
    function resetPosition() {
        canvas.style.left = originalX;
        canvas.style.top = originalY;
    }
    
    // Shake for 500ms
    const shakeInterval = setInterval(shake, 50);
    setTimeout(() => {
        clearInterval(shakeInterval);
        resetPosition();
    }, 500);
    
    // Create explosion particles - limit to prevent stalling
    const particleCount = 50; // Reduced from 100
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        const size = 3 + Math.random() * 7;
        const lifespan = 30 + Math.random() * 30;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: Math.random() > 0.5 ? '#ff6600' : '#ffff00',
            alpha: 1,
            decay: 1 / lifespan,
            update: function() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // Gravity
                this.alpha -= this.decay;
            },
            draw: function() {
                ctx.fillStyle = `rgba(${this.color === '#ff6600' ? '255,102,0' : '255,255,0'},${this.alpha})`;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }
    
    // Create explosion waves
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: x,
            y: y,
            size: 10,
            maxSize: 150 + i * 50,
            growSpeed: 8 + i * 2,
            alpha: 0.8,
            delay: i * 100,
            active: false,
            update: function() {
                if (!this.active) {
                    this.delay -= 16.67; // Approximately 60fps
                    if (this.delay <= 0) this.active = true;
                    return;
                }
                
                this.size += this.growSpeed;
                this.alpha -= 0.02;
            },
            draw: function() {
                if (!this.active) return;
                
                ctx.fillStyle = `rgba(255,100,0,${this.alpha})`;
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255,200,0,${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }
}

// Update and draw all particles
function updateParticles() {
    // Draw particles with limit
    const maxParticlesToProcess = 100; // Limit processing to prevent stalls
    const particlesToProcess = Math.min(particles.length, maxParticlesToProcess);
    
    for (let i = particlesToProcess - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // Draw score popups
    for (let i = scorePopups.length - 1; i >= 0; i--) {
        scorePopups[i].update();
        scorePopups[i].draw();
        
        if (scorePopups[i].alpha <= 0) {
            scorePopups.splice(i, 1);
        }
    }
}
