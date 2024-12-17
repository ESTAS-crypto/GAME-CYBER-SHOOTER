document.addEventListener('DOMContentLoaded', function() {
    // Audio elements
    const bgMusic = document.getElementById('bgMusic');
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');

    // Menu elements
    const mainMenu = document.querySelector('.main-menu');
    const settingsMenu = document.querySelector('.settings-menu');
    const creditsMenu = document.querySelector('.credits-menu');

    // Volume controls
    const musicVolume = document.getElementById('musicVolume');
    const sfxVolume = document.getElementById('sfxVolume');

    // Start background music
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => console.log('Audio autoplay prevented'));

    // Settings button click
    document.getElementById('settingsBtn').addEventListener('click', () => {
        playClickSound();
        mainMenu.classList.add('hidden');
        settingsMenu.classList.remove('hidden');
        // Reset transform after displaying
        setTimeout(() => {
            settingsMenu.style.transform = 'translateX(0)';
        }, 10);
    });

    // Credits button click
    document.getElementById('creditsBtn').addEventListener('click', () => {
        playClickSound();
        mainMenu.classList.add('hidden');
        creditsMenu.classList.remove('hidden');
        // Reset transform after displaying
        setTimeout(() => {
            creditsMenu.style.transform = 'translateX(0)';
        }, 10);
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            const activeMenu = document.querySelector('.settings-menu:not(.hidden), .credits-menu:not(.hidden)');
            if (activeMenu) {
                activeMenu.style.transform = 'translateX(100%)';
                // Wait for animation to complete before hiding
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
        });
    });

    // Difficulty selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Volume controls
    musicVolume.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value / 100;
        localStorage.setItem('musicVolume', e.target.value);
    });

    sfxVolume.addEventListener('input', (e) => {
        hoverSound.volume = clickSound.volume = e.target.value / 100;
        localStorage.setItem('sfxVolume', e.target.value);
    });

    // Hover sound effect
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log('Hover sound prevented'));
        });
    });

    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Click sound prevented'));
    }

    // Load saved settings
    const savedMusicVol = localStorage.getItem('musicVolume');
    const savedSfxVol = localStorage.getItem('sfxVolume');

    if (savedMusicVol) {
        musicVolume.value = savedMusicVol;
        bgMusic.volume = savedMusicVol / 100;
    }

    if (savedSfxVol) {
        sfxVolume.value = savedSfxVol;
        hoverSound.volume = clickSound.volume = savedSfxVol / 100;
    }
});