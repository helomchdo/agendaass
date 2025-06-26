import { eventAPI } from './services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('editActionForm');
  const deleteBtn = document.getElementById('deleteBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // Get event ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  async function loadEvent(id) {
    try {
      const events = await eventAPI.getAllEvents();
      const event = events.find(e => e.id === id);
      if (event) {
        document.getElementById('seiNumber').value = event.seiNumber || '';
        document.getElementById('sendDate').value = event.sendDate || '';
        document.getElementById('subject').value = event.subject || '';
        document.getElementById('requester').value = event.requester || '';
        document.getElementById('location').value = event.location || '';
        document.getElementById('focalPoint').value = event.focalPoint || '';
        document.getElementById('date').value = event.date || '';
        document.getElementById('status').value = event.status || '';
        document.getElementById('seiRequest').value = event.seiRequest || '';
      }
    } catch (error) {
      alert('Erro ao carregar a ação para edição.');
      console.error(error);
    }
  }

  async function saveEvent(data) {
    try {
      await eventAPI.updateEvent(eventId, data);
      alert('Ação atualizada com sucesso!');
      window.location.href = 'daily-agenda.html';
    } catch (error) {
      alert('Erro ao salvar a ação.');
      console.error(error);
    }
  }

  async function deleteEvent() {
    if (!confirm('Tem certeza que deseja excluir esta ação?')) return;
    try {
      await eventAPI.deleteEvent(eventId);
      alert('Ação excluída com sucesso!');
      window.location.href = 'daily-agenda.html';
    } catch (error) {
      alert('Erro ao excluir a ação.');
      console.error(error);
    }
  }

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      seiNumber: document.getElementById('seiNumber').value.trim(),
      sendDate: document.getElementById('sendDate').value,
      subject: document.getElementById('subject').value.trim(),
      requester: document.getElementById('requester').value.trim(),
      location: document.getElementById('location').value.trim(),
      focalPoint: document.getElementById('focalPoint').value.trim(),
      date: document.getElementById('date').value,
      status: document.getElementById('status').value,
      seiRequest: document.getElementById('seiRequest').value.trim()
    };

    if (!data.seiNumber || !data.sendDate || !data.subject || !data.requester || !data.location || !data.focalPoint || !data.date || !data.status) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    saveEvent(data);
  });

  deleteBtn.addEventListener('click', deleteEvent);

  cancelBtn.addEventListener('click', () => {
    window.location.href = 'daily-agenda.html';
  });

  if (eventId) {
    loadEvent(eventId);
  } else {
    alert('ID da ação não fornecido.');
    window.location.href = 'daily-agenda.html';
  }
});
