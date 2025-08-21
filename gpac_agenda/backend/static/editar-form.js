const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let dadosOriginais = {};

if (!id) {
  alert("ID não fornecido!");
  window.location.href = "monthly-dashboard.html";
}

async function carregarDados() {
  try {
    const res = await fetch(`/api/solicitacoes/${id}`);
    if (!res.ok) throw new Error("Erro ao carregar solicitação");
    const data = await res.json();
    dadosOriginais = data;

    const campos = [
      "sei", "data_envio_gpac", "assunto", "solicitante", "local",
      "ponto_focal", "data_evento", "hora", "situacao", "sei_diarias", "mes_referencia"
    ];

    campos.forEach(campo => {
      const el = document.getElementById(campo);
      if (!el) return;

      if (el.type === "date" && data[campo]) {
        el.value = data[campo].split("T")[0];
      } else if (el.type === "time" && data[campo]) {
        el.value = data[campo].substring(0, 5); // pega só HH:MM
      } else {
        el.value = data[campo] || '';
      }
    });
  } catch (err) {
    alert("Erro ao carregar os dados.");
    console.error(err);
  }
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const campos = [
    "sei", "data_envio_gpac", "assunto", "solicitante", "local",
    "ponto_focal", "data_evento", "hora", "situacao", "sei_diarias", "mes_referencia"
  ];

  const body = {};

  campos.forEach(campo => {
    const el = document.getElementById(campo);
    const novoValor = el.value;
    const valorOriginal = dadosOriginais[campo] || '';

    const comparado =
      el.type === "date"
        ? (valorOriginal?.split("T")[0] || '')
        : el.type === "time"
          ? (valorOriginal?.substring(0, 5) || '')
          : valorOriginal;

    if (novoValor !== comparado) {
      if (el.type === "time" && novoValor && novoValor.length === 5) {
        body[campo] = `${novoValor}:00`; // envia HH:MM:SS
      } else {
        body[campo] = novoValor;
      }
    }
  });

  if (Object.keys(body).length === 0) {
    alert("Nenhuma alteração detectada.");
    return;
  }

  try {
    console.log("Body enviado no PUT:", body); // debug
    const res = await fetch(`/api/solicitacoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Erro ao atualizar");

    alert("Atualizado com sucesso!");
    window.location.href = "monthly-dashboard.html";
  } catch (err) {
    alert("Erro ao salvar.");
    console.error(err);
  }
});

document.getElementById("btnExcluir").addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;

  try {
    const res = await fetch(`/api/solicitacoes/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao excluir");

    alert("Solicitação excluída com sucesso!");
    window.location.href = "monthly-dashboard.html";
  } catch (err) {
    alert("Erro ao excluir a solicitação.");
    console.error(err);
  }
});

carregarDados();
