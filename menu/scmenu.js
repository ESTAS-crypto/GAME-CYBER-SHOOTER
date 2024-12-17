document.addEventListener('DOMContentLoaded', function() {
    // Audio elements
    const bgMusic = document.getElementById('bgMusic');
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');

    // Menu elements
    const mainMenu = document.querySelector('.main-menu');
    const settingsMenu = document.querySelector('.settings-menu');
    const creditsMenu = document.querySelector('.credits-menu');
    const leaderboardMenu = document.querySelector('.leaderboard-menu');

    // Settings controls
    const musicVolume = document.getElementById('musicVolume');
    const sfxVolume = document.getElementById('sfxVolume');
    const sensitivity = document.getElementById('sensitivity');
    const autoAim = document.getElementById('autoAim');
    const screenShake = document.getElementById('screenShake');
    const graphicsQuality = document.getElementById('graphicsQuality');
    const vsync = document.getElementById('vsync');

    // Initialize game state
    let gameState = {
        selectedMode: '',
        selectedDifficulty: '',
        selectedCharacter: '',
        settings: {
            musicVolume: 50,
            sfxVolume: 70,
            sensitivity: 5,
            autoAim: true,
            screenShake: false,
            graphicsQuality: 'medium',
            vsync: true
        }
    };

    // Load saved settings
    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            gameState.settings = JSON.parse(savedSettings);

            // Apply saved settings to controls
            musicVolume.value = gameState.settings.musicVolume;
            sfxVolume.value = gameState.settings.sfxVolume;
            sensitivity.value = gameState.settings.sensitivity;
            autoAim.checked = gameState.settings.autoAim;
            screenShake.checked = gameState.settings.screenShake;
            graphicsQuality.value = gameState.settings.graphicsQuality;
            vsync.checked = gameState.settings.vsync;

            // Apply audio settings
            bgMusic.volume = gameState.settings.musicVolume / 100;
            hoverSound.volume = gameState.settings.sfxVolume / 100;
            clickSound.volume = gameState.settings.sfxVolume / 100;
        }
    }

    // Save settings
    function saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(gameState.settings));
    }

    // Audio functions
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Click sound prevented'));
    }

    function playHoverSound() {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => console.log('Hover sound prevented'));
    }

    // Start background music
    function initializeAudio() {
        bgMusic.volume = gameState.settings.musicVolume / 100;
        bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
    }

    // Menu navigation functions
    function showMenu(menu) {
        // Hide all menus
        [mainMenu, settingsMenu, creditsMenu, leaderboardMenu].forEach(m => {
            m.classList.add('hidden');
        });

        // Show selected menu
        menu.classList.remove('hidden');

        // Reset transform for animation
        if (menu !== mainMenu) {
            setTimeout(() => {
                menu.style.transform = 'translateX(0)';
            }, 10);
        }
    }

    // Button click handlers
    document.getElementById('settingsBtn').addEventListener('click', () => {
        playClickSound();
        showMenu(settingsMenu);
    });

    document.getElementById('creditsBtn').addEventListener('click', () => {
        playClickSound();
        showMenu(creditsMenu);
    });

    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        playClickSound();
        showMenu(leaderboardMenu);
    });

    // Back button handler
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            const activeMenu = document.querySelector('.settings-menu:not(.hidden), .credits-menu:not(.hidden), .leaderboard-menu:not(.hidden)');
            if (activeMenu) {
                activeMenu.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    activeMenu.classList.add('hidden');
                    mainMenu.classList.remove('hidden');
                }, 300);
            }
        });
    });

    // Game mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.selectedMode = btn.dataset.mode;
        });
    });

    // Difficulty selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.selectedDifficulty = btn.dataset.diff;
        });
    });

    // Character selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            playClickSound();
            document.querySelectorAll('.character-card').forEach(c => {
                c.style.border = '2px solid var(--neon-green)';
            });
            card.style.border = '2px solid var(--neon-blue)';
            gameState.selectedCharacter = card.dataset.character;
        });
    });

    // Settings controls handlers
    musicVolume.addEventListener('input', (e) => {
        gameState.settings.musicVolume = parseInt(e.target.value);
        bgMusic.volume = gameState.settings.musicVolume / 100;
        saveSettings();
        updateValueDisplay(e.target);
    });

    sfxVolume.addEventListener('input', (e) => {
        gameState.settings.sfxVolume = parseInt(e.target.value);
        hoverSound.volume = clickSound.volume = gameState.settings.sfxVolume / 100;
        saveSettings();
        updateValueDisplay(e.target);
    });

    sensitivity.addEventListener('input', (e) => {
        gameState.settings.sensitivity = parseInt(e.target.value);
        saveSettings();
        updateValueDisplay(e.target);
    });

    // Checkbox settings handlers
    [autoAim, screenShake, vsync].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            gameState.settings[e.target.id] = e.target.checked;
            saveSettings();
        });
    });

    // Graphics quality handler
    graphicsQuality.addEventListener('change', (e) => {
        gameState.settings.graphicsQuality = e.target.value;
        saveSettings();
    });

    // Value display updater
    function updateValueDisplay(input) {
        const display = input.nextElementSibling;
        if (display && display.classList.contains('value-display')) {
            display.textContent = input.type === 'range' ? `${input.value}%` : input.value;
        }
    }

    // Hover sound effect for all buttons
    document.querySelectorAll('button, .character-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (!element.classList.contains('selected')) {
                playHoverSound();
            }
        });
    });

    // Initialize
    loadSavedSettings();
    initializeAudio();

    // Update all value displays on load
    document.querySelectorAll('input[type="range"]').forEach(updateValueDisplay);

    // Start button handler
    document.getElementById('start-button').addEventListener('click', () => {
        playClickSound();
        // Show loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            const progress = loadingScreen.querySelector('.loading-progress');
            if (progress) {
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(interval);
                        // Proceed to game after loading
                        window.location.href = '../loading2/index.html';
                    } else {
                        width++;
                        progress.style.width = width + '%';
                    }
                }, 20);
            }
        }
    });
});
