document.addEventListener('DOMContentLoaded', () => {
    const dlBtn = document.getElementById('dlBtn');
    const videoUrl = document.getElementById('videoUrl');
    const statusContainer = document.getElementById('statusContainer');
    const statusText = document.getElementById('statusText');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const formatSelect = document.getElementById('format');

    const updateProgress = (percentage, message) => {
        progressBar.style.width = `${percentage}%`;
        progressPercent.textContent = `${Math.floor(percentage)}%`;
        if (message) statusText.textContent = message;
    };

    const startDownload = async () => {
        const url = videoUrl.value.trim();
        const format = formatSelect.value;

        if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
            showError('Please enter a valid YouTube link');
            return;
        }

        // UI Reset
        dlBtn.disabled = true;
        dlBtn.textContent = 'Processing...';
        statusContainer.classList.remove('hidden');
        updateProgress(5, 'Connecting to server...');

        try {
            // Real API Call Implementation:
            // const response = await fetch(`http://localhost:8000/download?url=${encodeURIComponent(url)}&format=${format}`);
            // if (!response.ok) throw new Error('Download failed');
            
            // For demo purposes, we simulate the logic:
            simulateProgress();

        } catch (error) {
            showError('Server connection failed. Is the backend running?');
            resetUI();
        }
    };

    const simulateProgress = () => {
        let step = 0;
        const messages = [
            'Fetching metadata...',
            'Analyzing streams...',
            'Downloading video chunks...',
            'Converting formats...',
            'Finalizing file...'
        ];

        const interval = setInterval(() => {
            step += Math.random() * 8;
            
            let msgIndex = Math.floor((step / 100) * messages.length);
            updateProgress(Math.min(step, 99), messages[msgIndex] || messages[messages.length - 1]);

            if (step >= 100) {
                clearInterval(interval);
                updateProgress(100, 'Download Complete!');
                dlBtn.textContent = 'Start New Download';
                dlBtn.disabled = false;
            }
        }, 300);
    };

    const showError = (msg) => {
        // Simple text swap for error handling
        statusContainer.classList.remove('hidden');
        statusText.classList.replace('text-blue-400', 'text-red-400');
        statusText.textContent = msg;
        setTimeout(() => {
            statusText.classList.replace('text-red-400', 'text-blue-400');
        }, 3000);
    };

    const resetUI = () => {
        dlBtn.disabled = false;
        dlBtn.textContent = 'Start Download';
    };

    dlBtn.addEventListener('click', startDownload);
});

