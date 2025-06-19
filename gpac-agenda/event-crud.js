import { eventAPI } from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("eventList");
  const eventModal = document.getElementById("eventModal");
  const modalTitle = document.getElementById("modalTitle");
  const eventForm = document.getElementById("eventForm");
  const btnAddEvent = document.getElementById("btnAddEvent");
  const btnCancel = document.getElementById("btnCancel");

  let events = [];
  let editingEventId = null;

  async function loadEvents() {
    try {
      events = await eventAPI.getAllEvents();
      renderEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events. Please try again.');
    }
  }

  function renderEvents() {
    eventList.innerHTML = "";
    if (events.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhum evento cadastrado.";
      li.style.textAlign = "center";
      li.style.color = "#64748b";
      eventList.appendChild(li);
      return;
    }
    events.forEach((event) => {
      const li = document.createElement("li");
      li.className = "event-item";

      const detailsDiv = document.createElement("div");
      detailsDiv.className = "event-details";
      detailsDiv.innerHTML = `
        <strong>${event.title}</strong><br/>
        ${new Date(event.date_time).toLocaleString("pt-BR")}<br/>
        ${event.location}
      `;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "event-actions";

      const btnView = document.createElement("button");
      btnView.textContent = "Visualizar";
      btnView.addEventListener("click", () => openModal(event.id, false));

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Editar";
      btnEdit.addEventListener("click", () => openModal(event.id, true));

      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Excluir";
      btnDelete.addEventListener("click", async () => {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
          try {
            await eventAPI.deleteEvent(event.id);
            await loadEvents(); // Reload events after deletion
          } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
          }
        }
      });

      actionsDiv.appendChild(btnView);
      actionsDiv.appendChild(btnEdit);
      actionsDiv.appendChild(btnDelete);

      li.appendChild(detailsDiv);
      li.appendChild(actionsDiv);

      eventList.appendChild(li);
    });
  }

  function openModal(eventId = null, editable = true) {
    editingEventId = eventId;
    if (eventId) {
      const event = events.find((e) => e.id === eventId);
      modalTitle.textContent = editable ? "Editar Evento" : "Detalhes do Evento";
      eventForm.eventTitle.value = event.title;
      eventForm.eventDateTime.value = event.date_time.slice(0, 16); // Format datetime for input
      eventForm.eventLocation.value = event.location;
      eventForm.eventDescription.value = event.description || '';
      eventForm.eventParticipants.value = event.participants || '';
      eventForm.eventReminders.value = event.reminders || '';
      Array.from(eventForm.elements).forEach((el) => {
        if (el.tagName !== "BUTTON") {
          el.disabled = !editable;
        }
      });
    } else {
      modalTitle.textContent = "Novo Evento";
      eventForm.reset();
      Array.from(eventForm.elements).forEach((el) => {
        if (el.tagName !== "BUTTON") {
          el.disabled = false;
        }
      });
    }
    eventModal.classList.add("active");
  }

  function closeModal() {
    eventModal.classList.remove("active");
    editingEventId = null;
  }

  btnAddEvent.addEventListener("click", () => openModal());

  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventData = {
      title: eventForm.eventTitle.value.trim(),
      date_time: eventForm.eventDateTime.value,
      location: eventForm.eventLocation.value.trim(),
      description: eventForm.eventDescription.value.trim(),
      participants: eventForm.eventParticipants.value.trim(),
      reminders: eventForm.eventReminders.value.trim(),
    };

    if (!eventData.title || !eventData.date_time || !eventData.location) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      if (editingEventId) {
        await eventAPI.updateEvent(editingEventId, eventData);
      } else {
        await eventAPI.createEvent(eventData);
      }
      await loadEvents(); // Reload events after creation/update
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  });

  // Load events when the page loads
  loadEvents();
});
