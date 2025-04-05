
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
    
    // Initialize clouds with improved shapes
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
    
    // Initialize mountains with smoother, more curved shapes
    mountains = [];
    const mountainColors = ['#5D4A8C', '#6B5A9E', '#7056A0', '#8367B3']; // Different blue-purple shades
    for (let i = 0; i < 3; i++) {
        mountains.push({
            x: i * canvas.width/3 + (Math.random() * 100 - 50),
            y: canvas.height * 0.5,
            width: 200 + Math.random() * 120,
            height: 120 + Math.random() * 100,
            color: mountainColors[i % mountainColors.length], // Use a different color for each mountain
            speed: 0.3,
            controlPoints: generateMountainControlPoints()
        });
    }
    
    // Initialize trees with better tree shapes
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
    
    // Initialize grass patches with fixed positions
    grassPatches = [];
    for (let i = 0; i < 40; i++) {
        grassPatches.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.6 + Math.random() * (canvas.height * 0.1),
            width: 20 + Math.random() * 30,
            height: 10 + Math.random() * 15,
            bladeCount: 3 + Math.floor(Math.random() * 5),
            speed: 0.5,
            // Generate stable blade shapes
            blades: generateGrassBlades()
        });
    }
    
    // Initialize wave points - moved up to connect with grass
    wavePoints = [];
    const numPoints = 20;
    for (let i = 0; i <= numPoints; i++) {
        wavePoints.push({
            x: (canvas.width / numPoints) * i,
            y: canvas.height * 0.7, // Moved up to connect with grass
            angle: Math.random() * Math.PI * 2
        });
    }
}

// Generate smoother mountain control points
function generateMountainControlPoints() {
    const controlPointCount = 8;
    const controlPoints = [];
    
    for (let i = 0; i < controlPointCount; i++) {
        // Create variation in height, but ensure the mountain shape is natural
        const heightFactor = 0.3 + Math.sin(i / (controlPointCount - 1) * Math.PI) * 0.7;
        controlPoints.push(heightFactor);
    }
    
    return controlPoints;
}

// Generate stable grass blades
function generateGrassBlades() {
    const bladeCount = 5;
    const blades = [];
    
    for (let i = 0; i < bladeCount; i++) {
        blades.push({
            height: 0.7 + Math.random() * 0.6,
            curve: (Math.random() - 0.5) * 10
        });
    }
    
    return blades;
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
        
        // Main cloud body - more rounded and puffy
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.width * 0.3, cloud.y + cloud.height * 0.5, 
               cloud.height * 0.6, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.7, cloud.y + cloud.height * 0.5, 
               cloud.height * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.5, cloud.y + cloud.height * 0.3, 
               cloud.height * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    // Draw improved mountains with smooth curves
    for (let i = 0; i < mountains.length; i++) {
        let mountain = mountains[i];
        // Update mountain position
        mountain.x -= mountain.speed * landscapeSpeed;
        if (mountain.x + mountain.width < 0) {
            mountain.x = canvas.width + Math.random() * 50;
            mountain.width = 200 + Math.random() * 120;
            mountain.height = 120 + Math.random() * 100;
            // Use a different color from the array
            mountain.color = ['#5D4A8C', '#6B5A9E', '#7056A0', '#8367B3'][Math.floor(Math.random() * 4)];
            // Generate new control points
            mountain.controlPoints = generateMountainControlPoints();
        }
        
        // Draw improved mountain with smooth curve
        ctx.fillStyle = mountain.color;
        ctx.strokeStyle = '#ff00ff'; // Neon pink outline
        ctx.lineWidth = 2;
        
        // Use bezier curves for smoother mountains
        ctx.beginPath();
        ctx.moveTo(mountain.x, mountain.y);
        
        const segmentWidth = mountain.width / (mountain.controlPoints.length - 1);
        
        // Draw the mountain using bezier curves for smoothness
        for (let j = 0; j < mountain.controlPoints.length - 1; j++) {
            const startX = mountain.x + j * segmentWidth;
            const startY = mountain.y - mountain.height * mountain.controlPoints[j];
            const endX = mountain.x + (j + 1) * segmentWidth;
            const endY = mountain.y - mountain.height * mountain.controlPoints[j + 1];
            
            // Control points for the bezier curve
            const ctrlX1 = startX + segmentWidth * 0.3;
            const ctrlY1 = startY;
            const ctrlX2 = endX - segmentWidth * 0.3;
            const ctrlY2 = endY;
            
            ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
        }
        
        ctx.lineTo(mountain.x + mountain.width, mountain.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // Draw grass base without gap
    drawGrassBase();
    
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
        
        // Draw foliage layers as triangles
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
    
    // Draw grass details with coherent movement
    drawGrassDetails();
    
    // Draw water with no gap to grass
    drawWater();
}

// Draw grass base
function drawGrassBase() {
    // Draw a solid grass layer from mountains to water with no gap
    const grassGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height * 0.7);
    grassGradient.addColorStop(0, '#1A472A'); // Dark green at mountain border
    grassGradient.addColorStop(1, '#2A603A'); // Slightly lighter green at water border
    
    ctx.fillStyle = grassGradient;
    ctx.beginPath();
    ctx.rect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.2);
    ctx.fill();
}

// Draw grass details with stable movement
function drawGrassDetails() {
    // Update and draw grass patches with consistent movement
    for (let grass of grassPatches) {
        // Update grass position
        grass.x -= grass.speed * landscapeSpeed;
        if (grass.x + grass.width < 0) {
            grass.x = canvas.width + Math.random() * 30;
            grass.y = canvas.height * 0.6 + Math.random() * (canvas.height * 0.08);
            grass.width = 20 + Math.random() * 30;
            grass.height = 10 + Math.random() * 15;
            grass.bladeCount = 3 + Math.floor(Math.random() * 5);
            // Generate new blades only when resetting
            grass.blades = generateGrassBlades();
        }
        
        // Draw detailed grass blades with stable patterns
        ctx.fillStyle = '#4CAF50'; // Bright green for grass blades
        ctx.strokeStyle = '#388E3C'; // Darker green for outlines
        ctx.lineWidth = 1;
        
        for (let j = 0; j < grass.bladeCount; j++) {
            const bladeX = grass.x + j * (grass.width / grass.bladeCount);
            // Use pre-generated values for stability
            const blade = grass.blades[j % grass.blades.length];
            
            ctx.beginPath();
            ctx.moveTo(bladeX, grass.y);
            ctx.quadraticCurveTo(
                bladeX + blade.curve, 
                grass.y - blade.height * grass.height * 0.6,
                bladeX, 
                grass.y - blade.height * grass.height
            );
            ctx.quadraticCurveTo(
                bladeX - blade.curve,
                grass.y - blade.height * grass.height * 0.6,
                bladeX, 
                grass.y
            );
            ctx.fill();
            ctx.stroke();
        }
    }
}

// Draw water connected to grass
function drawWater() {
    // Update wave points
    for (let i = 0; i < wavePoints.length; i++) {
        wavePoints[i].angle += 0.02; // Slower wave movement
        wavePoints[i].y = canvas.height * 0.7 + Math.sin(wavePoints[i].angle) * 5;
    }
    
    // Draw water with neon effect
    const gradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 120, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 50, 150, 0.7)');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#00ffff'; // Neon cyan
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, wavePoints[0].y);
    
    // Draw curved water surface using wave points
    for (let point of wavePoints) {
        ctx.lineTo(point.x, point.y);
    }
    
    ctx.lineTo(canvas.width, wavePoints[wavePoints.length-1].y);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw water surface line with glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, wavePoints[0].y);
    for (let point of wavePoints) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw water reflections (reduced - no fast moving objects)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * canvas.width;
        let y = canvas.height * 0.8 + Math.random() * (canvas.height * 0.15);
        let size = 2 + Math.random() * 3;
        
        ctx.beginPath();
        ctx.ellipse(x, y, size, size/2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
