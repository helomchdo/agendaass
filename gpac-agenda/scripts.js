document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      // Simple login validation (for demo purposes)
      // In real app, replace with backend authentication
      if (username === "usuario" && password === "senha123") {
        alert("Login bem-sucedido!");
        window.location.href = "daily-agenda.html"; // Redirect to next page
      } else {
        alert("Usuário ou senha inválidos.");
      }
    });
  }

  const googleLogin = document.getElementById("googleLogin");
  if (googleLogin) {
    googleLogin.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Login com Google não implementado.");
    });
  }
});
