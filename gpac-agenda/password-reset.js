document.addEventListener("DOMContentLoaded", () => {
  const passwordResetForm = document.getElementById("passwordResetForm");

  passwordResetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = document.getElementById("userInput").value.trim();

    if (!userInput) {
      alert("Por favor, preencha o campo.");
      return;
    }

    // TODO: Implement sending reset code logic
    alert(`Código de redefinição enviado para: ${userInput}`);
  });
});
