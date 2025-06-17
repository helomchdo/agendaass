document.addEventListener("DOMContentLoaded", () => {
  const eventList = document.getElementById("eventList");
  const eventModal = document.getElementById("eventModal");
  const modalTitle = document.getElementById("modalTitle");
  const eventForm = document.getElementById("eventForm");
  const btnAddEvent = document.getElementById("btnAddEvent");
  const btnCancel = document.getElementById("btnCancel");

  let events = [];
  let editingEventId = null;

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
        ${new Date(event.dateTime).toLocaleString("pt-BR")}<br/>
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
      btnDelete.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
          events = events.filter((e) => e.id !== event.id);
          renderEvents();
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
      eventForm.eventDateTime.value = event.dateTime;
      eventForm.eventLocation.value = event.location;
      eventForm.eventDescription.value = event.description;
      eventForm.eventParticipants.value = event.participants;
      eventForm.eventReminders.value = event.reminders;
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

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newEvent = {
      id: editingEventId || Date.now().toString(),
      title: eventForm.eventTitle.value.trim(),
      dateTime: eventForm.eventDateTime.value,
      location: eventForm.eventLocation.value.trim(),
      description: eventForm.eventDescription.value.trim(),
      participants: eventForm.eventParticipants.value.trim(),
      reminders: eventForm.eventReminders.value.trim(),
    };

    if (!newEvent.title || !newEvent.dateTime || !newEvent.location) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    if (editingEventId) {
      events = events.map((e) => (e.id === editingEventId ? newEvent : e));
    } else {
      events.push(newEvent);
    }

    renderEvents();
    closeModal();
  });

  renderEvents();
});
