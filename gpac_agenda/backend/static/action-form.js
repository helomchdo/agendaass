import { eventAPI } from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const actionForm = document.getElementById("actionForm");
  const confirmationMessage = document.getElementById("confirmation-message");

  const showMessage = (type, message) => {
    confirmationMessage.textContent = message;
    confirmationMessage.className = `confirmation-message ${type}`;
    confirmationMessage.classList.remove("hidden");
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      confirmationMessage.classList.add("hidden");
    }, 3000);
  };

  actionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Grab and trim input values
    const seiNumber = document.getElementById("seiNumber").value.trim();
    const sendDate = document.getElementById("sendDate").value;
    const subject = document.getElementById("subject").value.trim();
    const requester = document.getElementById("requester").value.trim();
    const location = document.getElementById("location").value.trim();
    const focalPoint = document.getElementById("focalPoint").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const seiRequest = document.getElementById("seiRequest").value.trim();

    // Validate mandatory fields
    if (!seiNumber || !sendDate || !subject || !requester || !location || !focalPoint || !date || !status) {
      showMessage("error", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Map form data to the expected database keys (snake_case)
    const eventDataForDb = {
      sei_number: seiNumber,
      send_date: sendDate,
      subject: subject,
      requester: requester,
      location: location,
      focal_point: focalPoint,
      date: date,
      status: status,
      sei_request: seiRequest
    };

    eventAPI.createEvent(eventDataForDb)
      .then(() => {
        showMessage("success", "Evento cadastrado com sucesso na agenda!");
        actionForm.reset();
      })
      .catch((error) => {
        console.error("Submission error:", error);
        showMessage("error", "Erro ao enviar formulário: " + error.message);
      });
  });

  actionForm.addEventListener("reset", () => {
    // Clear any validation states or confirmation messages
    confirmationMessage.classList.add("hidden");
  });
});
