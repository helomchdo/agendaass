document.addEventListener("DOMContentLoaded", () => {
  // Look for a placeholder element with id "app-header"
  const headerContainer = document.getElementById("app-header");
  if (headerContainer) {
    fetch('header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load header.");
        }
        return response.text();
      })
      .then(html => {
        headerContainer.innerHTML = html;
      })
      .catch(error => {
        console.error("Error loading header:", error);
        // Fallback: inject a basic header if needed
        headerContainer.innerHTML = `
          <header class="header">
            <span>GPAC Agenda</span>
          </header>`;
      });
  }
});
