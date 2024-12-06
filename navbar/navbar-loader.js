// navbar-loader.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to load navbar
    async function loadNavbar() {
      try {
        const response = await fetch('  navbar/navbar.html');
        const navbarHTML = await response.text();
        
        // Find the navbar container or insert before first child of body
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
          navbarContainer.innerHTML = navbarHTML;
        } else {
          document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
  
        // Highlight active page after loading
        setActiveNavLink();
      } catch (error) {
        console.error('Error loading navbar:', error);
      }
    }
  
    // Function to set active nav link based on current page
    function setActiveNavLink() {
      // Get current page filename
      const currentLocation = window.location.pathname.split('/').pop();
      
      // Select all nav links
      const navLinks = document.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
        // Get the href of the link and compare with current location
        const linkHref = link.getAttribute('href');
        
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Check if link matches current page (exact match or default to index)
        if (
          linkHref === currentLocation || 
          (currentLocation === '' && linkHref === 'index.html')
        ) {
          link.classList.add('active');
        }
      });
    }
  
    // Load navbar
    loadNavbar();
  });