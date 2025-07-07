import { eventAPI } from './services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const editForm = document.getElementById('editActionForm');
  const deleteBtn = document.getElementById('deleteBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const deleteModal = document.getElementById('deleteModal');
  const confirmDelete = document.getElementById('confirmDelete');
  const cancelDelete = document.getElementById('cancelDelete');
  const loader = document.getElementById('loader');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  // Get event ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  // Helper functions
  const showLoader = () => loader.classList.remove('hidden');
  const hideLoader = () => loader.classList.add('hidden');

  const showToast = (message, type = 'success') => {
    toastIcon.className = `fas ${type === 'success' ? 'fa-check text-green-500' : 'fa-exclamation-triangle text-red-500'}`;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  };

  const redirectToDailyAgenda = () => {
    window.location.href = 'daily-agenda.html';
  };

  async function loadEvent(id) {
    try {
      showLoader();
      const events = await eventAPI.getAllEvents();
      const event = events.find(e => String(e.id) === String(id));
      
      if (event) {
        const fields = {
          'seiNumber': event.sei_number,
          'sendDate': event.send_date,
          'subject': event.subject,
          'requester': event.requester,
          'location': event.location,
          'focalPoint': event.focal_point,
          'date': event.date,
          'status': event.status,
          'seiRequest': event.sei_request
        };

        Object.entries(fields).forEach(([id, value]) => {
          const element = document.getElementById(id);
          if (element) {
            element.value = value || '';
          } else {
            console.error(`Element with id '${id}' not found`);
          }
        });
      } else {
        showToast('Ação não encontrada', 'error');
        redirectToDailyAgenda();
      }
    } catch (error) {
      console.error('Error loading event:', error);
      showToast('Erro ao carregar a ação', 'error');
    } finally {
      hideLoader();
    }
  }

  async function saveEvent(data) {
    try {
      showLoader();
      // Convert field names to match backend
      const convertedData = {
        sei_number: data.seiNumber,
        send_date: data.sendDate,
        subject: data.subject,
        requester: data.requester,
        location: data.location,
        focal_point: data.focalPoint,
        date: data.date,
        status: data.status,
        sei_request: data.seiRequest
      };
      
      await eventAPI.updateEvent(eventId, convertedData);
      showToast('Ação atualizada com sucesso!');
      setTimeout(redirectToDailyAgenda, 1500);
    } catch (error) {
      console.error('Error saving event:', error);
      showToast('Erro ao salvar a ação', 'error');
    } finally {
      hideLoader();
    }
  }

  async function deleteEvent() {
    try {
      showLoader();
      await eventAPI.deleteEvent(eventId);
      showToast('Ação excluída com sucesso!');
      setTimeout(redirectToDailyAgenda, 1500);
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Erro ao excluir a ação', 'error');
    } finally {
      hideLoader();
    }
  }

  // Form submission handler
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

    // Hide all error messages first
    const errorMessages = document.querySelectorAll('[id$="-error"]');
    errorMessages.forEach(msg => msg.classList.add('hidden'));

    // Validate required fields
    const requiredFields = ['seiNumber', 'sendDate', 'subject', 'requester', 'location', 'focalPoint', 'date', 'status'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      // Show error messages for missing fields
      missingFields.forEach(field => {
        const inputElement = document.getElementById(field);
        const errorElement = document.getElementById(`${field}-error`);
        
        if (errorElement) {
          errorElement.classList.remove('hidden');
        }
        
        if (inputElement) {
          inputElement.classList.add('shake');
          // Remove the shake class after animation completes
          setTimeout(() => {
            inputElement.classList.remove('shake');
          }, 300);
        }
      });
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    saveEvent(data);
  });

  // Delete button handler
  deleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('hidden');
  });

  // Delete confirmation handlers
  confirmDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    deleteEvent();
  });

  cancelDelete.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
  });

  // Cancel button handler
  cancelBtn.addEventListener('click', redirectToDailyAgenda);

  // Add input event listeners to hide error messages
  requiredFields.forEach(field => {
    const element = document.getElementById(field);
    if (element) {
      element.addEventListener('input', () => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
          errorElement.classList.add('hidden');
        }
      });
    }
  });

  // Initialize
  if (eventId) {
    loadEvent(eventId);
  } else {
    showToast('ID da ação não fornecido', 'error');
    redirectToDailyAgenda();
  }
});
