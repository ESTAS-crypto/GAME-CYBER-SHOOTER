document.addEventListener('DOMContentLoaded', function() {
    const loadingBarFill = document.querySelector('.loading-bar-fill');
    const loadingProgress = document.getElementById('loading-progress');
    let progress = 0;

    function simulateLoading() {
        const interval = setInterval(() => {
            progress += Math.random() * 10;

            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                finishLoading();
            }

            loadingBarFill.style.width = `${progress}%`;
            loadingProgress.textContent = `${Math.floor(progress)}%`;
        }, 200);
    }

    function finishLoading() {
        setTimeout(() => {
            window.location.href = '../game/index.html';
        }, 1000);
    }

    // Start loading simulation
    simulateLoading();
});