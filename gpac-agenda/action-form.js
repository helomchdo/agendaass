import { eventAPI } from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const actionForm = document.getElementById("actionForm");

  actionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const seiNumber = document.getElementById("seiNumber").value.trim();
    const sendDate = document.getElementById("sendDate").value;
    const subject = document.getElementById("subject").value.trim();
    const requester = document.getElementById("requester").value.trim();
    const location = document.getElementById("location").value.trim();
    const focalPoint = document.getElementById("focalPoint").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const seiRequest = document.getElementById("seiRequest").value.trim();

    if (!seiNumber || !sendDate || !subject || !requester || !location || !focalPoint || !date || !status) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const eventData = {
      seiNumber,
      sendDate,
      subject,
      requester,
      location,
      focalPoint,
      date,
      status,
      seiRequest
    };

    eventAPI.createEvent(eventData)
      .then(() => {
        alert("Formulário enviado com sucesso!");
        actionForm.reset();
      })
      .catch((error) => {
        alert("Erro ao enviar formulário: " + error.message);
      });
  });

  actionForm.addEventListener("reset", () => {
    // Optional: clear any validation messages or states
  });
});
