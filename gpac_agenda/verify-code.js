document.addEventListener("DOMContentLoaded", () => {
  const verifyCodeForm = document.getElementById("verifyCodeForm");

  verifyCodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("code").value.trim();

    if (!code) {
      alert("Por favor, insira o código.");
      return;
    }

    // TODO: Implement code verification logic
    alert(`Código verificado: ${code}`);
  });
});
