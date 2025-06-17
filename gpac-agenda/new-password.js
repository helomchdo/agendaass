document.addEventListener("DOMContentLoaded", () => {
  const newPasswordForm = document.getElementById("newPasswordForm");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordMatchStatus = document.getElementById("passwordMatchStatus");

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

  newPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert("As senhas não são iguais.");
      return;
    }
    // TODO: Implement password reset logic
    alert("Senha redefinida com sucesso.");
  });
});
