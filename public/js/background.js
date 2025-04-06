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
    
    // Initialize clouds with expansion and contraction
    clouds = [];
    const cloudColors = ['rgba(200, 200, 255, 0.7)', 'rgba(210, 210, 255, 0.7)', 'rgba(220, 220, 255, 0.7)'];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 30 + Math.random() * 120, // Different heights
            baseY: 30 + Math.random() * 120, // Store the base Y position
            width: 70 + Math.random() * 60,
            height: 40 + Math.random() * 30,
            baseWidth: 70 + Math.random() * 60, // Store base width for pulsing
            baseHeight: 40 + Math.random() * 30, // Store base height for pulsing
            speed: 0.3 + Math.random() * 0.3,
            verticalSpeed: 0.2 + Math.random() * 0.2, // Speed for up/down movement
            verticalDirection: Math.random() > 0.5 ? 1 : -1, // Random initial direction
            verticalRange: 10 + Math.random() * 15, // Range of vertical movement
            color: cloudColors[Math.floor(Math.random() * cloudColors.length)], // Random cloud color
            fluffiness: 0.7 + Math.random() * 0.5, // Cloud fluffiness factor
            pulsePhase: Math.random() * Math.PI * 2, // Random starting phase for pulsing
            pulseSpeed: 0.01 + Math.random() * 0.02 // Speed of pulsing
        });
    }
    
    // Initialize mountains with curved organic shapes - no vertical lines
    mountains = [];
    const mountainColors = ['#5D4A8C', '#6B5A9E', '#7A68B2', '#8367B3']; // Different blue-purple shades
    for (let i = 0; i < 3; i++) {
        mountains.push({
            x: i * canvas.width/3 + (Math.random() * 100 - 50),
            y: canvas.height * 0.5,
            width: 200 + Math.random() * 120,
            height: 120 + Math.random() * 100,
            color: mountainColors[Math.floor(Math.random() * mountainColors.length)], // Use a different color for each mountain
            speed: 0.3,
            controlPoints: generateOrganicMountainControlPoints(8 + Math.floor(Math.random() * 5)) // More control points for smoother curves
        });
    }
    
    // Initialize trees with organic, natural shapes - no horizontal lines
    trees = [];
    const treeColors = ['#228B22', '#1D7A1D', '#25A025', '#2D8E2D'];
    const trunkColors = ['#8B4513', '#A05A2C', '#704214', '#5D4037'];
    
    for (let i = 0; i < 15; i++) {
        trees.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.5 + Math.random() * (canvas.height * 0.15),
            trunkHeight: 40 + Math.random() * 30,
            trunkWidth: 8 + Math.random() * 6,
            foliageLayers: 2 + Math.floor(Math.random() * 3),
            foliageSize: 30 + Math.random() * 20,
            speed: 0.7,
            color: treeColors[Math.floor(Math.random() * treeColors.length)], // Random tree color
            trunkColor: trunkColors[Math.floor(Math.random() * trunkColors.length)], // Random trunk color
            treeType: Math.random() > 0.5 ? 'pine' : 'rounded', // Different tree types
            branchCount: 2 + Math.floor(Math.random() * 4), // Random number of branches
            branchAngles: [] // Will store branch angles
        });
        
        // Generate random branch angles
        const tree = trees[trees.length - 1];
        for (let j = 0; j < tree.branchCount; j++) {
            tree.branchAngles.push({
                angle: (Math.random() - 0.5) * Math.PI * 0.5, // Random angle between -PI/4 and PI/4
                length: 0.3 + Math.random() * 0.4, // Length as percentage of trunk height
                thickness: 0.3 + Math.random() * 0.3 // Thickness as percentage of trunk width
            });
        }
    }
    
    // Initialize grass patches with fixed positions
    grassPatches = [];
    for (let i = 0; i < 40; i++) {
        grassPatches.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.5 + Math.random() * (canvas.height * 0.2), // Extended lower
            width: 20 + Math.random() * 30,
            height: 10 + Math.random() * 15,
            bladeCount: 3 + Math.floor(Math.random() * 5),
            speed: 0.5,
            // Generate stable blade shapes
            blades: generateGrassBlades()
        });
    }
    
    // Initialize wave points - moved closer to grass
    wavePoints = [];
    const numPoints = 20;
    for (let i = 0; i <= numPoints; i++) {
        wavePoints.push({
            x: (canvas.width / numPoints) * i,
            y: canvas.height * 0.75, // Moved down to match extended grass
            angle: Math.random() * Math.PI * 2
        });
    }
    
    // Initialize day/night cycle
    dayCycleProgress = 1.0; // Start at day
}

// Generate organic mountain control points with no vertical lines
function generateOrganicMountainControlPoints(pointCount = 10) {
    const controlPoints = [];
    
    // Use a sine-wave based approach for more natural mountains
    for (let i = 0; i < pointCount; i++) {
        // Create variation in height, but ensure the mountain shape is natural
        const t = i / (pointCount - 1);
        // Use sine and perlin-like functions for natural shapes
        // Middle points are higher, edges are lower
        const heightFactor = 0.2 + Math.sin(t * Math.PI) * 0.8 + (Math.random() * 0.2 - 0.1);
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

// Calculate sky color based on day/night cycle
function getSkyColor() {
    // Update day/night cycle based on game time
    dayCycleProgress = timeLeft / 60;
    
    // Night colors (deep blue)
    const nightR = 0;
    const nightG = 0;
    const nightB = 51;
    
    // Day colors (light blue)
    const dayR = 135;
    const dayG = 206;
    const dayB = 235;
    
    // Dawn/dusk colors (orange/purple tint)
    const transitionR = 65;
    const transitionG = 45;
    const transitionB = 90;
    
    let r, g, b;
    
    // Calculate transition colors
    if (dayCycleProgress > 0.8) {
        // Day (0.8-1.0)
        const t = (dayCycleProgress - 0.8) * 5; // 0-1 scale
        r = dayR;
        g = dayG;
        b = dayB;
    } else if (dayCycleProgress > 0.6) {
        // Dawn/Day transition (0.6-0.8)
        const t = (dayCycleProgress - 0.6) * 5; // 0-1 scale
        r = transitionR + (dayR - transitionR) * t;
        g = transitionG + (dayG - transitionG) * t;
        b = transitionB + (dayB - transitionB) * t;
    } else if (dayCycleProgress > 0.4) {
        // Dawn (0.4-0.6)
        r = transitionR;
        g = transitionG;
        b = transitionB;
    } else if (dayCycleProgress > 0.2) {
        // Night/Dawn transition (0.2-0.4)
        const t = (dayCycleProgress - 0.2) * 5; // 0-1 scale
        r = nightR + (transitionR - nightR) * t;
        g = nightG + (transitionG - nightG) * t;
        b = nightB + (transitionB - nightB) * t;
    } else {
        // Night (0-0.2)
        r = nightR;
        g = nightG;
        b = nightB;
    }
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}

// Draw all background elements
function drawBackground() {
    // Set sky color based on day/night cycle
    ctx.fillStyle = getSkyColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars - visible only at night
    if (dayCycleProgress < 0.7) {
        const starOpacity = Math.min(1, (0.7 - dayCycleProgress) * 3);
        for (let star of stars) {
            star.twinkle += star.twinkleSpeed;
            if (star.twinkle > 1) star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
            if (star.twinkle < 0) star.twinkleSpeed = Math.abs(star.twinkleSpeed);
            
            const brightness = 0.5 + star.twinkle * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness * starOpacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Draw improved clouds - using circles for a smoother look with vertical movement and pulsing
    for (let cloud of clouds) {
        // Update cloud horizontal position
        cloud.x -= cloud.speed * landscapeSpeed;
        
        // Update cloud vertical position with oscillation
        cloud.y += cloud.verticalSpeed * cloud.verticalDirection;
        const verticalDistance = Math.abs(cloud.y - cloud.baseY);
        
        // Reverse direction when reaching the range limit
        if (verticalDistance > cloud.verticalRange) {
            cloud.verticalDirection *= -1;
        }
        
        // Update cloud pulsing (expansion/contraction)
        cloud.pulsePhase += cloud.pulseSpeed;
        const pulseFactor = 1 + Math.sin(cloud.pulsePhase) * 0.15; // Pulse between 0.85x and 1.15x size
        cloud.width = cloud.baseWidth * pulseFactor;
        cloud.height = cloud.baseHeight * pulseFactor;
        
        // Reset cloud when it moves off-screen
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + Math.random() * 50;
            cloud.baseY = 30 + Math.random() * 120; // Different heights
            cloud.y = cloud.baseY;
            cloud.baseWidth = 70 + Math.random() * 60;
            cloud.baseHeight = 40 + Math.random() * 30;
            cloud.width = cloud.baseWidth;
            cloud.height = cloud.baseHeight;
            cloud.verticalSpeed = 0.2 + Math.random() * 0.2;
            cloud.verticalDirection = Math.random() > 0.5 ? 1 : -1;
            cloud.verticalRange = 10 + Math.random() * 15;
            cloud.fluffiness = 0.7 + Math.random() * 0.5;
            cloud.pulsePhase = Math.random() * Math.PI * 2;
            cloud.pulseSpeed = 0.01 + Math.random() * 0.02;
            // Random cloud color from array
            const cloudColors = ['rgba(200, 200, 255, 0.7)', 'rgba(210, 210, 255, 0.7)', 'rgba(220, 220, 255, 0.7)'];
            cloud.color = cloudColors[Math.floor(Math.random() * cloudColors.length)];
        }
        
        // Draw cloud with multiple circles for a fluffy look
        ctx.fillStyle = cloud.color;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        
        // Draw cloud using overlapping circles of varying sizes for a more organic shape
        const numPuffs = 8 + Math.floor(Math.random() * 5); // More puffs for complex clouds
        
        // Main central mass
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.width/2, cloud.y, cloud.height * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Surrounding puffs
        for (let i = 0; i < numPuffs; i++) {
            const angle = (i / numPuffs) * Math.PI * 2;
            const distance = cloud.width * 0.4 * (0.6 + Math.random() * 0.4);
            const puffX = cloud.x + cloud.width/2 + Math.cos(angle) * distance;
            const puffY = cloud.y + Math.sin(angle) * distance * 0.5;
            const puffSize = cloud.height * (0.3 + Math.random() * 0.4);
            
            ctx.beginPath();
            ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Draw improved mountains with bezier curves - no vertical lines
    for (let i = 0; i < mountains.length; i++) {
        let mountain = mountains[i];
        // Update mountain position
        mountain.x -= mountain.speed * landscapeSpeed;
        if (mountain.x + mountain.width < 0) {
            mountain.x = canvas.width + Math.random() * 50;
            mountain.width = 200 + Math.random() * 120;
            mountain.height = 120 + Math.random() * 100;
            // Use a different color from the array
            const mountainColors = ['#5D4A8C', '#6B5A9E', '#7A68B2', '#8367B3'];
            mountain.color = mountainColors[Math.floor(Math.random() * mountainColors.length)];
            // Generate new control points
            mountain.controlPoints = generateOrganicMountainControlPoints(8 + Math.floor(Math.random() * 5));
        }
        
        // Draw improved mountain with smooth curve
        ctx.fillStyle = mountain.color;
        ctx.strokeStyle = '#ff00ff'; // Neon pink outline
        ctx.lineWidth = 2;
        
        // Use bezier curves for smoother mountains - no vertical lines
        ctx.beginPath();
        ctx.moveTo(mountain.x, mountain.y);
        
        const segmentWidth = mountain.width / (mountain.controlPoints.length - 1);
        
        // Draw the mountain using bezier curves for smoothness
        for (let j = 0; j < mountain.controlPoints.length - 1; j++) {
            const startX = mountain.x + j * segmentWidth;
            const startY = mountain.y - mountain.height * mountain.controlPoints[j];
            const endX = mountain.x + (j + 1) * segmentWidth;
            const endY = mountain.y - mountain.height * mountain.controlPoints[j + 1];
            
            // Control points for the bezier curve - avoid straight lines by adding slight variation
            const ctrlX1 = startX + segmentWidth * (0.3 + Math.random() * 0.05);
            const ctrlY1 = startY - (Math.random() * 5);
            const ctrlX2 = endX - segmentWidth * (0.3 + Math.random() * 0.05);
            const ctrlY2 = endY - (Math.random() * 5);
            
            ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
        }
        
        ctx.lineTo(mountain.x + mountain.width, mountain.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // Draw grass base without gap - EXTENDED LOWER
    drawGrassBase();
    
    // Draw improved trees - more natural looking with no horizontal lines
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
            
            // Random tree and trunk colors
            const treeColors = ['#228B22', '#1D7A1D', '#25A025', '#2D8E2D'];
            const trunkColors = ['#8B4513', '#A05A2C', '#704214', '#5D4037'];
            tree.color = treeColors[Math.floor(Math.random() * treeColors.length)];
            tree.trunkColor = trunkColors[Math.floor(Math.random() * trunkColors.length)];
            
            // Random tree type and branch count
            tree.treeType = Math.random() > 0.5 ? 'pine' : 'rounded';
            tree.branchCount = 2 + Math.floor(Math.random() * 4);
            
            // Regenerate branch angles
            tree.branchAngles = [];
            for (let j = 0; j < tree.branchCount; j++) {
                tree.branchAngles.push({
                    angle: (Math.random() - 0.5) * Math.PI * 0.5,
                    length: 0.3 + Math.random() * 0.4,
                    thickness: 0.3 + Math.random() * 0.3
                });
            }
        }
        
        // Draw tree trunk with organic shape - no straight lines
        ctx.fillStyle = tree.trunkColor;
        ctx.strokeStyle = '#5D3A22'; // Darker brown for trunk texture
        ctx.lineWidth = 1;
        
        // Draw trunk with slight curve for a more natural look
        const trunkCurve = (Math.random() - 0.5) * 5;
        
        ctx.beginPath();
        ctx.moveTo(tree.x - tree.trunkWidth/2, tree.y);
        
        // Left trunk edge with slight curve
        ctx.bezierCurveTo(
            tree.x - tree.trunkWidth/2 - trunkCurve/2, tree.y - tree.trunkHeight * 0.3,
            tree.x - tree.trunkWidth/2 + trunkCurve, tree.y - tree.trunkHeight * 0.7,
            tree.x - tree.trunkWidth/3, tree.y - tree.trunkHeight
        );
        
        // Top of trunk
        ctx.lineTo(tree.x + tree.trunkWidth/3, tree.y - tree.trunkHeight);
        
        // Right trunk edge with slight curve
        ctx.bezierCurveTo(
            tree.x + tree.trunkWidth/2 - trunkCurve, tree.y - tree.trunkHeight * 0.7,
            tree.x + tree.trunkWidth/2 + trunkCurve/2, tree.y - tree.trunkHeight * 0.3,
            tree.x + tree.trunkWidth/2, tree.y
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw branches
        for (let branch of tree.branchAngles) {
            const branchStartY = tree.y - tree.trunkHeight * (0.3 + Math.random() * 0.5);
            const branchStartX = tree.x + (Math.random() - 0.5) * tree.trunkWidth;
            const branchLength = tree.trunkHeight * branch.length;
            const branchWidth = tree.trunkWidth * branch.thickness;
            const branchEndX = branchStartX + Math.cos(branch.angle) * branchLength;
            const branchEndY = branchStartY + Math.sin(branch.angle) * branchLength;
            
            // Draw branch with natural taper
            ctx.beginPath();
            ctx.moveTo(branchStartX - branchWidth/2, branchStartY);
            
            // Curve the branch slightly
            const ctrlX1 = branchStartX + branchLength * 0.3 * Math.cos(branch.angle);
            const ctrlY1 = branchStartY + branchLength * 0.3 * Math.sin(branch.angle);
            const ctrlX2 = branchStartX + branchLength * 0.7 * Math.cos(branch.angle);
            const ctrlY2 = branchStartY + branchLength * 0.7 * Math.sin(branch.angle);
            
            // Top curve of branch
            ctx.bezierCurveTo(
                ctrlX1, ctrlY1 - branchWidth/3,
                ctrlX2, ctrlY2 - branchWidth/4,
                branchEndX, branchEndY
            );
            
            // Bottom curve of branch
            ctx.bezierCurveTo(
                ctrlX2, ctrlY2 + branchWidth/4,
                ctrlX1, ctrlY1 + branchWidth/3,
                branchStartX + branchWidth/2, branchStartY
            );
            
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        // Draw foliage based on tree type
        ctx.fillStyle = tree.color;
        ctx.strokeStyle = '#00ff00'; // Neon green outline
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 7;
        
        if (tree.treeType === 'pine') {
            // Draw a pine tree with multiple triangular layers
            for (let i = 0; i < tree.foliageLayers; i++) {
                const layerSize = tree.foliageSize * (1 - i * 0.15);
                const layerY = tree.y - tree.trunkHeight - i * (tree.foliageSize * 0.4);
                
                // Draw triangular pine tree layer with curved edges
                ctx.beginPath();
                ctx.moveTo(tree.x, layerY - layerSize); // Top point
                
                // Right side curve
                ctx.bezierCurveTo(
                    tree.x + layerSize * 0.3, layerY - layerSize * 0.7,
                    tree.x + layerSize * 0.5, layerY - layerSize * 0.3,
                    tree.x + layerSize * 0.5, layerY
                );
                
                // Bottom curve slightly wavy
                ctx.bezierCurveTo(
                    tree.x + layerSize * 0.3, layerY + Math.sin(i * 2) * 3,
                    tree.x - layerSize * 0.3, layerY + Math.cos(i * 2) * 3,
                    tree.x - layerSize * 0.5, layerY
                );
                
                // Left side curve
                ctx.bezierCurveTo(
                    tree.x - layerSize * 0.5, layerY - layerSize * 0.3,
                    tree.x - layerSize * 0.3, layerY - layerSize * 0.7,
                    tree.x, layerY - layerSize
                );
                
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        } else {
            // Draw a rounded tree with an irregular organic shape
            const foliageX = tree.x;
            const foliageY = tree.y - tree.trunkHeight - tree.foliageSize * 0.5;
            
            // Main rounded foliage
            ctx.beginPath();
            ctx.arc(foliageX, foliageY, tree.foliageSize * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Add irregular bumps around the main circle
            const bumpCount = 8;
            for (let i = 0; i < bumpCount; i++) {
                const angle = (i / bumpCount) * Math.PI * 2;
                const distance = tree.foliageSize * 0.6 * (0.7 + Math.random() * 0.4);
                const bumpX = foliageX + Math.cos(angle) * distance;
                const bumpY = foliageY + Math.sin(angle) * distance;
                const bumpSize = tree.foliageSize * (0.3 + Math.random() * 0.3);
                
                ctx.beginPath();
                ctx.arc(bumpX, bumpY, bumpSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Draw grass details with coherent movement
    drawGrassDetails();
    
    // Draw water with no gap to grass
    drawWater();
}

// Draw grass base - EXTENDED LOWER
function drawGrassBase() {
    // Draw a solid grass layer from mountains to water with no gap - EXTENDED DOWN
    const grassGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height * 0.8);
    grassGradient.addColorStop(0, '#1A472A'); // Dark green at mountain border
    grassGradient.addColorStop(1, '#2A603A'); // Slightly lighter green at water border
    
    ctx.fillStyle = grassGradient;
    ctx.beginPath();
    ctx.rect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.3); // Extended height
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
            grass.y = canvas.height * 0.6 + Math.random() * (canvas.height * 0.05);
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

// Draw water connected to grass - MOVED DOWN and same color as waves
function drawWater() {
    // Update wave points
    for (let i = 0; i < wavePoints.length; i++) {
        wavePoints[i].angle += 0.02; // Slower wave movement
        wavePoints[i].y = canvas.height * 0.75 + Math.sin(wavePoints[i].angle) * 5; // Moved down to match extended grass
    }
    
    // Use consistent water color for both water and waves
    const waterColor = 'rgba(0, 180, 255, 0.7)'; // Brighter cyan-blue
    const waterDeep = 'rgba(0, 120, 230, 0.7)'; // Slightly darker blue
    
    // Draw water with neon effect
    const gradient = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height);
    gradient.addColorStop(0, waterColor);
    gradient.addColorStop(1, waterDeep);
    
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
    
    // Draw water surface line with glow - same color as the water
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00ffff'; // Same neon cyan
    ctx.beginPath();
    ctx.moveTo(0, wavePoints[0].y);
    for (let point of wavePoints) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
}
