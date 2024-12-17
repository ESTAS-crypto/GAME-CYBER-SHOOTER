// Game Settings and State Management
class GameState {
    constructor() {
        this.health = 100;
        this.shield = 100;
        this.score = 0;
        this.multiplier = 1;
        this.currentAmmo = 30;
        this.totalAmmo = 90;
        this.isPaused = false;
        this.isGameOver = false;
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const defaultSettings = {
            audio: {
                master: 100,
                music: 50,
                sfx: 70
            },
            graphics: {
                resolution: 'auto',
                quality: 'medium',
                vsync: true,
                fullscreen: false
            },
            gameplay: {
                sensitivity: 5,
                autoAim: true,
                screenShake: true,
                damageNumbers: true
            },
            controls: {
                forward: 'W',
                back: 'S',
                left: 'A',
                right: 'D',
                jump: 'SPACE',
                sprint: 'SHIFT'
            }
        };

        const savedSettings = localStorage.getItem('gameSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }
}

// Audio Manager
class AudioManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.bgMusic = document.getElementById('bgMusic');
        this.hoverSound = document.getElementById('hoverSound');
        this.clickSound = document.getElementById('clickSound');
        this.initializeAudio();
    }

    initializeAudio() {
        const { master, music, sfx } = this.gameState.settings.audio;
        this.bgMusic.volume = (master / 100) * (music / 100);
        this.hoverSound.volume = this.clickSound.volume = (master / 100) * (sfx / 100);
    }

    playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play prevented:', e));
    }

    updateVolumes() {
        this.initializeAudio();
    }
}

// Canvas Manager
class CanvasManager {
    constructor() {
        this.gameCanvas = document.getElementById('gameCanvas');
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.ctx = this.gameCanvas.getContext('2d');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.minimapCanvas.width = this.minimapCanvas.clientWidth;
        this.minimapCanvas.height = this.minimapCanvas.clientHeight;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.minimapCtx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
    }
}

// HUD Manager
class HUDManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.initializeHUDElements();
    }

    initializeHUDElements() {
        this.healthBar = document.querySelector('.health-fill');
        this.shieldBar = document.querySelector('.shield-fill');
        this.healthText = document.querySelector('.health-text');
        this.shieldText = document.querySelector('.shield-text');
        this.currentAmmoText = document.querySelector('.current-ammo');
        this.totalAmmoText = document.querySelector('.total-ammo');
        this.scoreText = document.querySelector('.score span');
        this.multiplierText = document.querySelector('.multiplier span');
    }

    updateHUD() {
        // Update health and shield bars
        this.healthBar.style.width = `${this.gameState.health}%`;
        this.shieldBar.style.width = `${this.gameState.shield}%`;
        this.healthText.textContent = Math.ceil(this.gameState.health);
        this.shieldText.textContent = Math.ceil(this.gameState.shield);

        // Update ammo display
        this.currentAmmoText.textContent = this.gameState.currentAmmo;
        this.totalAmmoText.textContent = `/ ${this.gameState.totalAmmo}`;

        // Update score and multiplier
        this.scoreText.textContent = this.gameState.score.toLocaleString();
        this.multiplierText.textContent = `×${this.gameState.multiplier}`;
    }

    showDamageIndicator() {
        const indicator = document.getElementById('damage-indicator');
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 300);
    }

    addKillFeed(message) {
        const killFeed = document.getElementById('kill-feed');
        const killMessage = document.createElement('div');
        killMessage.className = 'kill-message';
        killMessage.textContent = message;
        killFeed.appendChild(killMessage);

        setTimeout(() => {
            killFeed.removeChild(killMessage);
        }, 3000);
    }

    showPowerupNotification(powerup) {
        const notifications = document.getElementById('powerup-notifications');
        const notification = document.createElement('div');
        notification.className = 'powerup-notification';
        notification.textContent = `${powerup} acquired!`;
        notifications.appendChild(notification);

        setTimeout(() => {
            notifications.removeChild(notification);
        }, 3000);
    }
}

// Menu Manager
class MenuManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.initializeMenus();
        this.setupEventListeners();
    }

    initializeMenus() {
        this.pauseMenu = document.getElementById('pause-menu');
        this.gameOverMenu = document.getElementById('game-over');
        this.settingsMenu = document.getElementById('settings-menu');
    }

    setupEventListeners() {
        // Pause menu listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.gameState.isGameOver) {
                this.togglePause();
            }
        });

        // Settings menu listeners
        const settingsInputs = document.querySelectorAll('#settings-menu input, #settings-menu select');
        settingsInputs.forEach(input => {
            input.addEventListener('change', () => this.updateSettings(input));
        });

        // Menu button listeners
        document.querySelectorAll('.menu-options button').forEach(button => {
            button.addEventListener('click', () => this.handleMenuButton(button));
        });
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        this.pauseMenu.classList.toggle('hidden', !this.gameState.isPaused);

        if (this.gameState.isPaused) {
            // Pause game logic
            this.pauseGame();
        } else {
            // Resume game logic
            this.resumeGame();
        }
    }

    showGameOver() {
        this.gameState.isGameOver = true;
        this.gameOverMenu.classList.remove('hidden');
        const finalScore = document.querySelector('.final-score span');
        const highScore = document.querySelector('.high-score span');

        finalScore.textContent = this.gameState.score.toLocaleString();

        // Update high score
        const currentHighScore = localStorage.getItem('highScore') || 0;
        if (this.gameState.score > currentHighScore) {
            localStorage.setItem('highScore', this.gameState.score);
        }
        highScore.textContent = Math.max(currentHighScore, this.gameState.score).toLocaleString();
    }

    updateSettings(input) {
        const setting = input.id;
        const value = input.type === 'checkbox' ? input.checked : input.value;

        // Update the appropriate setting category
        if (setting.includes('Volume')) {
            this.gameState.settings.audio[setting.toLowerCase()] = parseInt(value);
        } else if (setting.includes('graphics')) {
            this.gameState.settings.graphics[setting] = value;
        } else {
            this.gameState.settings.gameplay[setting] = value;
        }

        this.gameState.saveSettings();
    }

    handleMenuButton(button) {
        switch (button.className) {
            case 'resume-btn':
                this.togglePause();
                break;
            case 'retry-btn':
                this.restartGame();
                break;
            case 'quit-btn':
                this.quitGame();
                break;
        }
    }

    pauseGame() {
        // Add pause logic here
        // e.g., stop game loop, pause audio, etc.
    }

    resumeGame() {
        // Add resume logic here
        // e.g., restart game loop, resume audio, etc.
    }

    restartGame() {
        // Reset game state and restart
        location.reload();
    }

    quitGame() {
        // Return to main menu
        window.location.href = '../mainmenu/index.html';
    }
}

// Game Controller
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.audioManager = new AudioManager(this.gameState);
        this.canvasManager = new CanvasManager();
        this.hudManager = new HUDManager(this.gameState);
        this.menuManager = new MenuManager(this.gameState);

        this.setupEventListeners();
        this.startGame();
    }

    setupEventListeners() {
        // Mouse movement for aiming
        document.addEventListener('mousemove', (e) => {
            if (!this.gameState.isPaused && !this.gameState.isGameOver) {
                this.handleMouseMove(e);
            }
        });

        // Mouse click for shooting
        document.addEventListener('mousedown', (e) => {
            if (!this.gameState.isPaused && !this.gameState.isGameOver) {
                this.handleShoot(e);
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameState.isPaused && !this.gameState.isGameOver) {
                this.handleKeyDown(e);
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.canvasManager.resizeCanvas();
        });
    }

    handleMouseMove(e) {
        // Add mouse movement logic here
        // e.g., update aim direction, rotate player model, etc.
    }

    handleShoot(e) {
        if (this.gameState.currentAmmo > 0) {
            this.gameState.currentAmmo--;
            // Add shooting logic here
            // e.g., create projectile, play sound, etc.
            this.hudManager.updateHUD();
        }
    }

    handleKeyDown(e) {
        // Add movement and action key handling here
        // e.g., WASD movement, jumping, etc.
    }

    startGame() {
        // Initialize game loop
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameState.isPaused && !this.gameState.isGameOver) {
            // Clear canvas
            this.canvasManager.clearCanvas();

            // Update game state
            this.update();

            // Render frame
            this.render();
        }

        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Add game state update logic here
        // e.g., move entities, check collisions, update scores, etc.
    }

    render() {
        // Add rendering logic here
        // e.g., draw player, enemies, projectiles, effects, etc.
    }

    takeDamage(amount) {
        // Handle shield first
        if (this.gameState.shield > 0) {
            if (this.gameState.shield >= amount) {
                this.gameState.shield -= amount;
                amount = 0;
            } else {
                amount -= this.gameState.shield;
                this.gameState.shield = 0;
            }
        }

        // Apply remaining damage to health
        if (amount > 0) {
            this.gameState.health = Math.max(0, this.gameState.health - amount);
            if (this.gameState.health === 0) {
                this.menuManager.showGameOver();
            }
        }

        this.hudManager.showDamageIndicator();
        this.hudManager.updateHUD();
    }

    addScore(points) {
        this.gameState.score += points * this.gameState.multiplier;
        this.hudManager.updateHUD();
    }

    updateMultiplier(value) {
        this.gameState.multiplier = value;
        this.hudManager.updateHUD();
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
});
