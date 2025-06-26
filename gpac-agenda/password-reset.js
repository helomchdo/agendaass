document.addEventListener("DOMContentLoaded", () => {
  const passwordResetForm = document.getElementById("passwordResetForm");

  passwordResetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = document.getElementById("userInput").value.trim();

    if (!userInput) {
      alert("Por favor, preencha o campo.");
      return;
    }

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: userInput })
      });
      if (!response.ok) throw new Error('Failed to send reset code');
      alert(`Código de redefinição enviado para: ${userInput}`);
      window.location.href = 'verify-code.html';
    } catch (error) {
      alert('Erro ao enviar código de redefinição.');
      console.error(error);
    }
  });
});
