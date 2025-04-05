
// Background elements and rendering

// Initialize background elements
function initBackground() {
    // Initialize stars
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6,
            size: Math.random() * 2 + 1,
            twinkle: Math.random() * 0.1,
            twinkleSpeed: 0.05 + Math.random() * 0.05
        });
    }
    
    // Initialize clouds (improved cloud shapes)
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * 100,
            width: 70 + Math.random() * 60,
            height: 40 + Math.random() * 30,
            speed: 0.3 + Math.random() * 0.3,
            fluffiness: 0.7 + Math.random() * 0.5 // Cloud fluffiness factor
        });
    }
    
    // Initialize mountains (more realistic mountain shapes)
    mountains = [];
    for (let i = 0; i < 3; i++) {
        mountains.push({
            x: i * canvas.width/3 + (Math.random() * 100 - 50),
            y: canvas.height * 0.5,
            width: 200 + Math.random() * 120,
            height: 120 + Math.random() * 100,
            jaggedness: 0.2 + Math.random() * 0.3, // Mountain jaggedness factor
            peakCount: 3 + Math.floor(Math.random() * 3), // Number of peaks
            speed: 0.3
        });
    }
    
    // Initialize trees (more detailed trees)
    trees = [];
    for (let i = 0; i < 15; i++) {
        trees.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.5 + Math.random() * (canvas.height * 0.15),
            trunkHeight: 40 + Math.random() * 30,
            trunkWidth: 8 + Math.random() * 6,
            foliageLayers: 2 + Math.floor(Math.random() * 3),
            foliageSize: 30 + Math.random() * 20,
            speed: 0.7
        });
    }
    
    // Initialize grass patches
    grassPatches = [];
    for (let i = 0; i < 40; i++) {
        grassPatches.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.6 + Math.random() * (canvas.height * 0.1),
            width: 20 + Math.random() * 30,
            height: 10 + Math.random() * 15,
            bladeCount: 3 + Math.floor(Math.random() * 5),
            speed: 0.5
        });
    }
    
    // Initialize wave points
    wavePoints = [];
    const numPoints = 20;
    for (let i = 0; i <= numPoints; i++) {
        wavePoints.push({
            x: (canvas.width / numPoints) * i,
            y: canvas.height * 0.75,
            angle: Math.random() * Math.PI * 2
        });
    }
}

// Draw all background elements
function drawBackground() {
    // Draw stars
    for (let star of stars) {
        star.twinkle += star.twinkleSpeed;
        if (star.twinkle > 1) star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
        if (star.twinkle < 0) star.twinkleSpeed = Math.abs(star.twinkleSpeed);
        
        const brightness = 0.5 + star.twinkle * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw improved clouds
    for (let cloud of clouds) {
        // Update cloud position
        cloud.x -= cloud.speed * landscapeSpeed;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + Math.random() * 50;
            cloud.y = 50 + Math.random() * 100;
            cloud.width = 70 + Math.random() * 60;
            cloud.height = 40 + Math.random() * 30;
            cloud.fluffiness = 0.7 + Math.random() * 0.5;
        }
        
        // Draw improved cloud with multiple puffs
        ctx.fillStyle = 'rgba(200, 200, 255, 0.7)';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        
        // Main cloud body
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.width/2, cloud.y + cloud.height/2, 
                   cloud.width/2, cloud.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud puffs - more detailed to look more like clouds
        const puffCount = Math.floor(cloud.width / 20);
        for (let i = 0; i < puffCount; i++) {
            const puffX = cloud.x + (i / puffCount) * cloud.width;
            const puffY = cloud.y + (Math.sin(i * 0.8) * cloud.height * 0.2);
            const puffSize = (cloud.height * 0.6) * cloud.fluffiness * (0.7 + Math.sin(i) * 0.3);
            
            ctx.beginPath();
            ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Draw improved mountains
    for (let mountain of mountains) {
        // Update mountain position
        mountain.x -= mountain.speed * landscapeSpeed;
        if (mountain.x + mountain.width < 0) {
            mountain.x = canvas.width + Math.random() * 50;
            mountain.width = 200 + Math.random() * 120;
            mountain.height = 120 + Math.random() * 100;
            mountain.jaggedness = 0.2 + Math.random() * 0.3;
            mountain.peakCount = 3 + Math.floor(Math.random() * 3);
        }
        
        // Draw improved mountain range with multiple peaks
        ctx.fillStyle = '#7056A0'; // Improved mountain color
        ctx.strokeStyle = '#ff00ff'; // Neon pink outline
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(mountain.x, mountain.y);
        
        // Create multi-peak mountain
        const peakSpacing = mountain.width / mountain.peakCount;
        for (let i = 0; i <= mountain.peakCount; i++) {
            const peakX = mountain.x + i * peakSpacing;
            let peakHeight = 0;
            
            if (i === 0 || i === mountain.peakCount) {
                peakHeight = mountain.height * 0.5; // Lower heights at edges
            } else {
                peakHeight = mountain.height * (0.8 + Math.random() * 0.4); // Varied heights
            }
            
            // Add some jaggedness to peaks
            if (i > 0) {
                const segmentCount = 5;
                const segmentWidth = peakSpacing / segmentCount;
                
                for (let j = 1; j <= segmentCount; j++) {
                    const segX = mountain.x + (i-1) * peakSpacing + j * segmentWidth;
                    const segHeight = mountain.y - Math.max(0, 
                        ((j / segmentCount) * peakHeight + 
                        ((segmentCount - j) / segmentCount) * prevPeakHeight) + 
                        (Math.random() * 2 - 1) * mountain.jaggedness * 20);
                    
                    ctx.lineTo(segX, segHeight);
                }
            }
            
            prevPeakHeight = peakHeight;
        }
        
        ctx.lineTo(mountain.x + mountain.width, mountain.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw snow caps on taller peaks
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        
        for (let i = 1; i < mountain.peakCount; i++) {
            if (Math.random() > 0.3) continue; // Only some peaks have snow
            
            const peakX = mountain.x + i * peakSpacing;
            const snowWidth = peakSpacing * 0.4;
            const snowHeight = mountain.height * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(peakX - snowWidth, mountain.y - mountain.height * 0.75);
            ctx.lineTo(peakX, mountain.y - mountain.height * 0.9);
            ctx.lineTo(peakX + snowWidth, mountain.y - mountain.height * 0.75);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Draw grass layer between mountains and water
    drawGrass();
    
    // Draw water
    drawWater();
    
    // Draw improved trees
    for (let tree of trees) {
        // Update tree position
        tree.x -= tree.speed * landscapeSpeed;
        if (tree.x + tree.foliageSize < 0) {
            tree.x = canvas.width + Math.random() * 30;
            tree.y = canvas.height * 0.5 + Math.random() * (canvas.height * 0.15);
            tree.trunkHeight = 40 + Math.random() * 30;
            tree.trunkWidth = 8 + Math.random() * 6;
            tree.foliageLayers = 2 + Math.floor(Math.random() * 3);
            tree.foliageSize = 30 + Math.random() * 20;
        }
        
        // Draw improved tree with multiple foliage layers
        
        // Draw tree trunk with texture
        ctx.fillStyle = '#8B4513'; // Brown
        ctx.strokeStyle = '#5D3A22'; // Darker brown for trunk texture
        ctx.lineWidth = 1;
        
        // Main trunk
        ctx.fillRect(tree.x - tree.trunkWidth/2, 
                    tree.y - tree.trunkHeight, 
                    tree.trunkWidth, 
                    tree.trunkHeight);
        
        // Trunk texture
        for (let i = 0; i < 3; i++) {
            const lineX = tree.x - tree.trunkWidth/2 + tree.trunkWidth * (0.3 + i * 0.25);
            ctx.beginPath();
            ctx.moveTo(lineX, tree.y - tree.trunkHeight);
            ctx.lineTo(lineX, tree.y);
            ctx.stroke();
        }
        
        // Draw foliage layers
        ctx.fillStyle = '#228B22'; // Forest green
        ctx.strokeStyle = '#00ff00'; // Neon green outline
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 7;
        
        for (let i = 0; i < tree.foliageLayers; i++) {
            const layerSize = tree.foliageSize * (1 - i * 0.15);
            const layerY = tree.y - tree.trunkHeight - i * (tree.foliageSize * 0.4);
            
            ctx.beginPath();
            // Draw a triangle for each foliage layer
            ctx.moveTo(tree.x - layerSize/2, layerY);
            ctx.lineTo(tree.x, layerY - layerSize);
            ctx.lineTo(tree.x + layerSize/2, layerY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
    }
}

// Draw water
function drawWater() {
    // Update wave points
    for (let i = 0; i < wavePoints.length; i++) {
        wavePoints[i].angle += 0.02; // Slower wave movement
        wavePoints[i].y = canvas.height * 0.75 + Math.sin(wavePoints[i].angle) * 5;
    }
    
    // Draw water with neon effect
    const gradient = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 120, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 50, 150, 0.7)');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#00ffff'; // Neon cyan
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.75);
    
    // Draw curved water surface using wave points
    for (let point of wavePoints) {
        ctx.lineTo(point.x, point.y);
    }
    
    ctx.lineTo(canvas.width, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw water surface line with glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.75);
    for (let point of wavePoints) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw water reflections
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * canvas.width;
        let y = canvas.height * 0.8 + Math.random() * (canvas.height * 0.15);
        let size = 2 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.ellipse(x, y, size, size/2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw grass (new function)
function drawGrass() {
    // Draw grass layer
    ctx.fillStyle = '#1A472A'; // Dark green base
    ctx.beginPath();
    ctx.rect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.15);
    ctx.fill();
    
    // Update and draw grass patches
    for (let grass of grassPatches) {
        // Update grass position
        grass.x -= grass.speed * landscapeSpeed;
        if (grass.x + grass.width < 0) {
            grass.x = canvas.width + Math.random() * 30;
            grass.y = canvas.height * 0.6 + Math.random() * (canvas.height * 0.1);
            grass.width = 20 + Math.random() * 30;
            grass.height = 10 + Math.random() * 15;
            grass.bladeCount = 3 + Math.floor(Math.random() * 5);
        }
        
        // Draw detailed grass blades
        ctx.fillStyle = '#4CAF50'; // Bright green for grass blades
        ctx.strokeStyle = '#388E3C'; // Darker green for outlines
        ctx.lineWidth = 1;
        
        for (let i = 0; i < grass.bladeCount; i++) {
            const bladeX = grass.x + i * (grass.width / grass.bladeCount);
            const bladeHeight = grass.height * (0.7 + Math.random() * 0.6);
            const bladeCurve = (Math.random() - 0.5) * 10;
            
            ctx.beginPath();
            ctx.moveTo(bladeX, grass.y);
            ctx.quadraticCurveTo(
                bladeX + bladeCurve, 
                grass.y - bladeHeight * 0.6,
                bladeX, 
                grass.y - bladeHeight
            );
            ctx.quadraticCurveTo(
                bladeX - bladeCurve,
                grass.y - bladeHeight * 0.6,
                bladeX, 
                grass.y
            );
            ctx.fill();
            ctx.stroke();
        }
    }
    
    // Add some grass at the edge of the water
    ctx.strokeStyle = '#64DD17'; // Light green for grass edge highlights
    ctx.lineWidth = 2;
    
    for (let i = 0; i < canvas.width; i += 10) {
        const height = 5 + Math.random() * 8;
        
        ctx.beginPath();
        ctx.moveTo(i, canvas.height * 0.75);
        ctx.lineTo(i, canvas.height * 0.75 - height);
        ctx.stroke();
    }
}
