function startSession() {
    // Clear any existing interval to prevent multiple timers
    if (window.sessionTimer) {
        clearInterval(window.sessionTimer);
    }

    // Track current session start time
    const currentTime = new Date();
    const timerElement = document.getElementById('currentSessionTime');
    // Log initial current time
    console.log(currentTime);



    // Initialize session time tracking
    let sessionTime = 0;

    // Start session timer
    window.sessionTimer = setInterval(function () {
        sessionTime++;

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(sessionTime / 3600);
        const minutes = Math.floor((sessionTime % 3600) / 60);
        const seconds = sessionTime % 60;

        // Format time to always show two digits
        const formattedTime = 
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');

        // Update the timer text
        timerElement.textContent = formattedTime;

        // Optional: Stop timer after a specific duration
        // if (sessionTime > 3600) { // e.g., stop after 1 hour
        //     clearInterval(window.sessionTimer);
        // }
    }, 1000);
}
