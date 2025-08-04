import { eventAPI } from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const actionForm = document.getElementById("actionForm");
  const confirmationMessage = document.getElementById("confirmation-message");

  const showMessage = (type, message) => {
    confirmationMessage.textContent = message;
    confirmationMessage.className = `confirmation-message ${type}`;
    confirmationMessage.classList.remove("hidden");

    setTimeout(() => {
      confirmationMessage.classList.add("hidden");
    }, 3000);
  };

  if (!actionForm) {
    console.error("Formulário #actionForm não encontrado no HTML.");
    return;
  }

  actionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta dos valores
    const seiNumber = document.getElementById("seiNumber").value.trim();
    const sendDate = document.getElementById("sendDate").value;
    const subject = document.getElementById("subject").value.trim();
    const requester = document.getElementById("requester").value.trim();
    const location = document.getElementById("location").value.trim();
    const focalPoint = document.getElementById("focalPoint").value.trim(); // não obrigatório
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const seiRequest = document.getElementById("seiRequest").value.trim(); // não obrigatório
    const monthRef = document.getElementById("monthRef").value;

    // Validação obrigatórios
    if (!seiNumber || !sendDate || !subject || !requester || !location || !date || !status || !monthRef) {
      showMessage("error", "Preencha todos os campos obrigatórios.");
      return;
    }

    const eventDataForDb = {
      sei: seiNumber,
      data_envio_gpac: sendDate,
      assunto: subject,
      solicitante: requester,
      local: location,
      ponto_focal: focalPoint || null,
      data_evento: date,
      situacao: status,
      sei_diarias: seiRequest || null,
      mes_referencia: monthRef
    };

    try {
      await eventAPI.createEvent(eventDataForDb);
      showMessage("success", "Solicitação cadastrada com sucesso!");
      actionForm.reset();
    } catch (error) {
      console.error("Erro ao enviar:", error);
      showMessage("error", "Erro ao enviar: " + error.message);
    }
  });

  actionForm.addEventListener("reset", () => {
    confirmationMessage.classList.add("hidden");
  });
});
