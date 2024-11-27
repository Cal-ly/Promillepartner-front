document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    
    // Function to apply dark mode
    const applyDarkMode = (isDark) => {
        if (isDark) {
            // Add dark mode to body
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
            
            // Change navbar to dark variant
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.remove('navbar-light', 'bg-light');
                navbar.classList.add('navbar-dark', 'bg-dark');
            }
            
            // Change icon
            darkModeIcon.textContent = '☀️';
            
            // Ensure all nav links are visible
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#f0f0f0';
            });
        } else {
            // Remove dark mode from body
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
            
            // Revert navbar to light variant
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.classList.remove('navbar-dark', 'bg-dark');
                navbar.classList.add('navbar-light', 'bg-light');
            }
            
            // Change icon
            darkModeIcon.textContent = '🌙';
            
            // Reset nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '';
            });
        }
    };

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Apply saved dark mode preference on page load
    if (savedDarkMode === 'enabled') {
        applyDarkMode(true);
    }
    
    // Toggle dark mode when button is clicked
    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        applyDarkMode(!isDarkMode);
        
        // Save preference to localStorage
        if (!isDarkMode) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.removeItem('darkMode');
        }
    });
});