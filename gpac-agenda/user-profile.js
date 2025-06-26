document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const cancelBtn = document.getElementById('cancelBtn');

  async function loadUserProfile() {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const user = await response.json();
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
    } catch (error) {
      alert('Erro ao carregar perfil do usuário.');
      console.error(error);
    }
  }

  async function saveUserProfile(data) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update user profile');
      alert('Perfil atualizado com sucesso!');
      window.location.href = 'daily-agenda.html';
    } catch (error) {
      alert('Erro ao salvar perfil do usuário.');
      console.error(error);
    }
  }

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (password && password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const data = { name, email };
    if (password) {
      data.password = password;
    }

    await saveUserProfile(data);
  });

  cancelBtn.addEventListener('click', () => {
    window.location.href = 'daily-agenda.html';
  });

  loadUserProfile();
});
