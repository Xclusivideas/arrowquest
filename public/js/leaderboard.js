// Leaderboard functionality

// Initialize the localStorage key
const LEADERBOARD_KEY = 'arrow_quest_leaderboard';

// Load leaderboard from localStorage
function loadLeaderboard() {
    try {
        const saved = localStorage.getItem(LEADERBOARD_KEY);
        if (saved) {
            leaderboard = JSON.parse(saved);
        } else {
            leaderboard = [];
        }
    } catch (e) {
        console.error('Error loading leaderboard:', e);
        leaderboard = [];
    }
}

// Save leaderboard to localStorage
function saveLeaderboard() {
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (e) {
        console.error('Error saving leaderboard:', e);
    }
}

// Add score to leaderboard
function addScoreToLeaderboard(name, playerScore) {
    // Create new entry
    const newEntry = {
        name: name,
        score: playerScore,
        date: new Date().toISOString()
    };
    
    // Add to leaderboard
    leaderboard.push(newEntry);
    
    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top entries
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }
    
    // Save to localStorage
    saveLeaderboard();
}

// Render leaderboard in the DOM
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No scores yet!';
        leaderboardList.appendChild(li);
        return;
    }
    
    // Display top 5 entries
    const displayCount = Math.min(5, leaderboard.length);
    for (let i = 0; i < displayCount; i++) {
        const entry = leaderboard[i];
        const li = document.createElement('li');
        
        // Highlight current player
        if (entry.name === playerName && entry.score === score) {
            li.style.color = '#ffff00';
            li.style.fontWeight = 'bold';
        }
        
        // Format date
        const date = new Date(entry.date);
        const dateStr = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
        
        // Create entry content
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${i+1}. ${entry.name}`;
        
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `${entry.score} pts`;
        
        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        leaderboardList.appendChild(li);
    }
}

// Initialize leaderboard
function initLeaderboard() {
    loadLeaderboard();
}
