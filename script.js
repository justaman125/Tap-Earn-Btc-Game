// ===== GAME STATE =====
let gameState = {
    btc: 0.00000001,
    multiplier: 1,
    totalEarned: 0.00000001,
    tapCount: 0
};

// Multiplier config
const multipliers = [
    { level: 2, cost: 0.00000010, label: '2x' },
    { level: 5, cost: 0.00000100, label: '5x' },
    { level: 10, cost: 0.00001000, label: '10x' },
    { level: 25, cost: 0.00010000, label: '25x' },
    { level: 50, cost: 0.00100000, label: '50x' },
    { level: 100, cost: 0.01000000, label: '100x' }
];

const EARN_PER_TAP = 0.00000001;

// ===== DOM ELEMENTS =====
const tapButton = document.getElementById('tapButton');
const shopGrid = document.getElementById('shopGrid');
const btcDisplay = document.getElementById('btcDisplay');
const multiplierDisplay = document.getElementById('multiplierDisplay');
const clicksDisplay = document.getElementById('clicksDisplay');
const totalEarnedDisplay = document.getElementById('totalEarnedDisplay');
const earningsPerTapDisplay = document.getElementById('earningsPerTapDisplay');
const resetButton = document.getElementById('resetButton');

// ===== INITIALIZATION =====
function init() {
    loadGame();
    createShopButtons();
    attachEventListeners();
    updateDisplay();
}

// ===== LOAD/SAVE GAME =====
function loadGame() {
    const saved = localStorage.getItem('btcGameState');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading game state:', e);
            saveGame();
        }
    }
}

function saveGame() {
    localStorage.setItem('btcGameState', JSON.stringify(gameState));
}

// ===== TAP HANDLING =====
function handleTap(e) {
    const earnAmount = EARN_PER_TAP * gameState.multiplier;
    
    // Update state
    gameState.btc += earnAmount;
    gameState.totalEarned += earnAmount;
    gameState.tapCount += 1;
    
    // Visual feedback
    createFloatingText(e, earnAmount);
    
    // Update display
    updateDisplay();
    
    // Save progress
    saveGame();
}

function createFloatingText(event, amount) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = `+${amount.toFixed(8)}`;
    
    const rect = tapButton.getBoundingClientRect();
    floatingText.style.left = (rect.left + rect.width / 2) + 'px';
    floatingText.style.top = (rect.top + rect.height / 2) + 'px';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

// ===== SHOP BUTTONS =====
function createShopButtons() {
    shopGrid.innerHTML = '';
    
    multipliers.forEach((m, idx) => {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        
        const isCurrentMultiplier = m.level === gameState.multiplier;
        const isAffordable = gameState.btc >= m.cost;
        const isUpgrade = idx > getCurrentMultiplierIndex();
        
        // Set classes
        if (isCurrentMultiplier) {
            button.classList.add('active');
        } else if (isAffordable && isUpgrade) {
            button.classList.add('available');
        } else {
            button.classList.add('disabled');
        }
        
        // Create button content
        button.innerHTML = `
            <div class="button-shine"></div>
            <div class="button-inner">
                <span class="upgrade-label">${m.label}</span>
                <span class="upgrade-cost">${m.cost.toFixed(8)}</span>
            </div>
            ${isCurrentMultiplier ? '<div class="active-dot"></div>' : ''}
        `;
        
        // Add click handler
        button.addEventListener('click', () => {
            if (isUpgrade && isAffordable) {
                buyMultiplier(m);
            }
        });
        
        button.disabled = !(isUpgrade && isAffordable);
        
        shopGrid.appendChild(button);
    });
}

function getCurrentMultiplierIndex() {
    return multipliers.findIndex(m => m.level === gameState.multiplier);
}

function buyMultiplier(multiplierData) {
    if (gameState.btc >= multiplierData.cost) {
        gameState.btc -= multiplierData.cost;
        gameState.multiplier = multiplierData.level;
        
        updateDisplay();
        createShopButtons();
        saveGame();
    }
}

// ===== DISPLAY UPDATE =====
function updateDisplay() {
    btcDisplay.textContent = gameState.btc.toFixed(8);
    multiplierDisplay.textContent = gameState.multiplier;
    clicksDisplay.textContent = gameState.tapCount;
    totalEarnedDisplay.textContent = gameState.totalEarned.toFixed(8);
    earningsPerTapDisplay.textContent = (EARN_PER_TAP * gameState.multiplier).toFixed(8);
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    tapButton.addEventListener('click', handleTap);
    
    // Reset button (for debugging only)
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your progress?')) {
            gameState = {
                btc: 0.00000001,
                multiplier: 1,
                totalEarned: 0.00000001,
                tapCount: 0
            };
            updateDisplay();
            createShopButtons();
            saveGame();
        }
    });
}

// ===== SPECIAL FEATURES =====
// Unlock reset button with Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'a' ? e.key.toLowerCase() : e.code;
    
    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            resetButton.style.display = 'block';
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ===== START GAME =====
window.addEventListener('DOMContentLoaded', init);
