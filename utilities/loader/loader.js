document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Hide the loading overlay when the page is fully loaded
    window.addEventListener('load', () => {
        loadingOverlay.style.display = 'none';
    });
});

// Show the loading overlay during reload
window.addEventListener('beforeunload', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
});
