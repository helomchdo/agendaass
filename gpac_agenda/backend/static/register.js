document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("As senhas não são iguais.");
      return;
    }
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Cadastro realizado com sucesso! Faça login.');
      window.location.href = 'index.html';
    } else {
      alert(result.error || 'Erro ao cadastrar');
    }
  });
});