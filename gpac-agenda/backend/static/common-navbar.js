document.addEventListener("DOMContentLoaded", () => {
  // Look for a placeholder element with id "app-navbar"
  const navbarContainer = document.getElementById("app-navbar");
  if (navbarContainer) {
    fetch('navbar.html')
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load navbar.");
        }
        return response.text();
      })
      .then(html => {
        navbarContainer.innerHTML = html;
        
        // Set active page based on current URL
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const navItems = navbarContainer.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
          const itemPage = item.getAttribute('data-page');
          if (itemPage === currentPage) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      })
      .catch(error => {
        console.error("Error loading navbar:", error);
        // Fallback: inject a basic navbar if needed
        navbarContainer.innerHTML = `
          <nav class="nav-bottom">
            <div class="nav-container">
              <span>GPAC Agenda</span>
            </div>
          </nav>`;
      });
  }
});
