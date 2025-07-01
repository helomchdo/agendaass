// Registration form validation and username availability simulation
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const usernameInput = document.getElementById("username");
  const usernameStatus = document.getElementById("usernameStatus");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordMatchStatus = document.getElementById("passwordMatchStatus");

  // Simulate username availability check
  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (username.length > 2) {
      // Simulate async check with timeout
      setTimeout(() => {
        if (username.endsWith("1")) {
          usernameStatus.textContent = "disponível";
          usernameStatus.style.color = "green";
        } else {
          usernameStatus.textContent = "indisponível";
          usernameStatus.style.color = "red";
        }
      }, 300);
    } else {
      usernameStatus.textContent = "";
    }
  });

  // Check password match
  function checkPasswordMatch() {
    if (passwordInput.value && confirmPasswordInput.value) {
      if (passwordInput.value === confirmPasswordInput.value) {
        passwordMatchStatus.textContent = "as senhas são iguais";
        passwordMatchStatus.style.color = "green";
      } else {
        passwordMatchStatus.textContent = "as senhas não são iguais";
        passwordMatchStatus.style.color = "red";
      }
    } else {
      passwordMatchStatus.textContent = "";
    }
  }

  passwordInput.addEventListener("input", checkPasswordMatch);
  confirmPasswordInput.addEventListener("input", checkPasswordMatch);

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("As senhas não são iguais.");
      return;
    }
    // TODO: Implement registration logic
    alert(`Cadastro realizado para: ${usernameInput.value}`);
  });
});
