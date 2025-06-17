// Basic login form submission handler
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

      // TODO: Implement actual login logic here
      alert(`Login realizado com usuário: ${username}`);
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
