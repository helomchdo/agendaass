const form = document.getElementById("action-form");
const statusText = document.getElementById("statusText");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const assunto = document.getElementById("subject").value;
  const solicitante = document.getElementById("requester").value;
  const sei = document.getElementById("seiNumber").value;
  const sei_diarias = document.getElementById("seiRequest").value; // corrigido
  const local = document.getElementById("location").value;
  const ponto_focal = document.getElementById("focalPoint").value; // corrigido
  const data_evento = document.getElementById("date").value; // corrigido
  const situacao = document.getElementById("status").value; // corrigido
  //const hora = document.getElementById("time").value;
  const data_envio_gpac = new Date().toISOString();

  // Gera mes_referencia a partir da data_evento
  let mes_referencia = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(data_evento)) {
    const [ano, mes] = data_evento.split("-");
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const mesRefStr = meses[parseInt(mes, 10) - 1];
    const anoStr = ano.slice(-2);
    mes_referencia = `${mesRefStr}${anoStr}`;
  } else {
    alert("Por favor, insira uma data válida no campo 'Data da Ação'.");
    return;
  }

  const eventDataForDb = {
    sei,
    data_envio_gpac,
    assunto,
    solicitante,
    local,
    ponto_focal: ponto_focal || null,
    data_evento,
    //hora,
    situacao,
    sei_diarias: sei_diarias || null,
    mes_referencia
  };

  try {
    const response = await fetch("/api/solicitacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventDataForDb)
    });

    if (!response.ok) throw new Error("Erro ao cadastrar ação");

    statusText.textContent = "Ação cadastrada com sucesso!";
    statusText.className = "success-message";
    form.reset();
  } catch (error) {
    console.error(error);
    statusText.textContent = "Erro ao cadastrar ação.";
    statusText.className = "error-message";
  }
});
