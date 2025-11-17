document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error('/api/login error', res.status, text);
      let jsonBody = {};
      try { jsonBody = JSON.parse(text); } catch {}
      alert(jsonBody.error || `Erro no login (status ${res.status})`);
      return;
    }

    const payload = await res.json();
    localStorage.setItem('token', payload.token);
    window.location.href = 'daily-agenda.html';
  } catch (err) {
    console.error(err);
    alert('Erro de rede ao tentar logar');
  }
});