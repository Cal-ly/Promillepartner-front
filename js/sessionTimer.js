var sessionTimer; // Declare sessionTimer in the outer scope

function startSession() {
    var sessionTime = 0;
    var timerElement = document.getElementById('currentSessionTime');

    // Clear any existing interval
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }

    sessionTimer = setInterval(function () {
        sessionTime++;

        // Calculate hours, minutes, and seconds
        var hours = Math.floor(sessionTime / 3600);
        var minutes = Math.floor((sessionTime % 3600) / 60);
        var seconds = sessionTime % 60;

        // Format time to always show two digits
        var formattedTime = 
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');

        // Update the timer text
        timerElement.textContent = formattedTime;

        // Optional: Stop timer after a specific duration
        // if (sessionTime > 3600) { // e.g., stop after 1 hour
        //     clearInterval(sessionTimer);
        // }
    }, 1000);
}