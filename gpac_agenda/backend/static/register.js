// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) {
    console.warn("registerForm não encontrado no DOM.");
    return;
  }

  const fullNameInput = document.getElementById("fullName");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = registerForm.querySelector('button[type="submit"]');

  function getValue(el) {
    return el ? el.value.trim() : "";
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = getValue(fullNameInput);
    const username = getValue(usernameInput);
    const email = getValue(emailInput);
    const password = getValue(passwordInput);
    const confirmPassword = getValue(confirmPasswordInput);

    if (!email || !password) {
      alert("E-mail e senha são obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        alert(body.message || "Cadastro realizado com sucesso. Faça login.");
        window.location.href = "index.html";
        return;
      }

      alert(body.error || body.message || "Erro ao cadastrar usuário.");
    } catch (err) {
      console.error("Erro network /api/register:", err);
      alert("Erro de rede ao tentar cadastrar. Tente novamente.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Cadastrar";
      }
    }
  });
});
```// filepath: c:\Users\fnque\Downloads\agendaass-3\gpac_agenda\backend\static\register.js
// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) {
    console.warn("registerForm não encontrado no DOM.");
    return;
  }

  const fullNameInput = document.getElementById("fullName");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitBtn = registerForm.querySelector('button[type="submit"]');

  function getValue(el) {
    return el ? el.value.trim() : "";
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = getValue(fullNameInput);
    const username = getValue(usernameInput);
    const email = getValue(emailInput);
    const password = getValue(passwordInput);
    const confirmPassword = getValue(confirmPasswordInput);

    if (!email || !password) {
      alert("E-mail e senha são obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        alert(body.message || "Cadastro realizado com sucesso. Faça login.");
        window.location.href = "index.html";
        return;
      }

      alert(body.error || body.message || "Erro ao cadastrar usuário.");
    } catch (err) {
      console.error("Erro network /api/register:", err);
      alert("Erro de rede ao tentar cadastrar. Tente novamente.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Cadastrar";
      }
    }
  });
});