import { supabase } from './supabaseclient.js'

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('username').value.trim(); // usa id 'username' do index.html
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const payload = await res.json();

    if (!res.ok) {
      alert(payload.error || 'Falha no login');
      return;
    }

    // salvar token JWT
    localStorage.setItem('token', payload.token);
    // opcional: salvar usuário
    if (payload.username) localStorage.setItem('username', payload.username);

    window.location.href = 'daily-agenda.html';
  } catch (err) {
    console.error(err);
    alert('Erro de rede ao tentar logar');
  }
});