const listaAcoes = document.getElementById("lista-acoes");
const loading = document.getElementById("loading");

async function fetchAcoes() {
  try {
    loading.classList.remove("hidden");
    const response = await fetch("/api/solicitacoes");
    if (!response.ok) throw new Error("Erro ao buscar ações");
    const data = await response.json();

    return data.map(item => ({
      sei: item.sei,
      assunto: item.assunto,
      solicitante: item.solicitante,
      local: item.local,
      pontoFocal: item.ponto_focal,
      dataEnvio: item.data_envio_gpac?.split("T")[0],
      dataEvento: item.data_evento,
      situacao: item.situacao,
      seiDiarias: item.sei_diarias
    }));
  } catch (error) {
    alert("Erro ao carregar ações.");
    console.error(error);
    return [];
  } finally {
    loading.classList.add("hidden");
  }
}

function renderAcoes(lista) {
  listaAcoes.innerHTML = "";

  if (lista.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "no-events-container";
    vazio.innerHTML = `
      <i class="fas fa-inbox no-events-icon"></i>
      <p class="no-events-message">Nenhuma ação encontrada</p>
    `;
    listaAcoes.appendChild(vazio);
    return;
  }

  lista.forEach(acao => {
    const el = document.createElement("li");
    el.className = "event-card";
    el.innerHTML = `
      <div class="event-header">
        <h3>${acao.assunto || "Sem título"}</h3>
        <span class="status-${acao.situacao?.toLowerCase()?.replace(/_/g, '-') || 'indefinido'}">${acao.situacao || '-'}</span>
      </div>
      <p><strong>Nº SEI:</strong> ${acao.sei || '-'}</p>
      <p><strong>Solicitante:</strong> ${acao.solicitante || '-'}</p>
      <p><strong>Local:</strong> ${acao.local || '-'}</p>
      <p><strong>Ponto Focal:</strong> ${acao.pontoFocal || '-'}</p>
      <p><strong>Data Evento:</strong> ${acao.dataEvento || '-'}</p>
      <p><strong>Data Envio:</strong> ${acao.dataEnvio || '-'}</p>
      <p><strong>SEI Diárias:</strong> ${acao.seiDiarias || '-'}</p>
    `;
    listaAcoes.appendChild(el);
  });
}

function aplicarFiltros(lista) {
  const f = campo => document.getElementById(campo).value.toLowerCase().trim();
  const fd = id => document.getElementById(id).value;

  return lista.filter(acao => {
    return (
      (!f("filtro-num-sei") || acao.sei?.toLowerCase().includes(f("filtro-num-sei"))) &&
      (!f("filtro-assunto") || acao.assunto?.toLowerCase().includes(f("filtro-assunto"))) &&
      (!f("filtro-solicitante") || acao.solicitante?.toLowerCase().includes(f("filtro-solicitante"))) &&
      (!f("filtro-local") || acao.local?.toLowerCase().includes(f("filtro-local"))) &&
      (!f("filtro-ponto-focal") || acao.pontoFocal?.toLowerCase().includes(f("filtro-ponto-focal"))) &&
      (!fd("filtro-data-envio") || acao.dataEnvio === fd("filtro-data-envio")) &&
      (!fd("filtro-data") || acao.dataEvento === fd("filtro-data")) &&
      (!f("filtro-situacao") || acao.situacao === document.getElementById("filtro-situacao").value) &&
      (!f("filtro-sei-solicitacao") || acao.seiDiarias?.toLowerCase().includes(f("filtro-sei-solicitacao")))
    );
  });
}

let todasAcoes = [];

document.getElementById("filtro-form").addEventListener("submit", e => {
  e.preventDefault();
  const resultado = aplicarFiltros(todasAcoes);
  renderAcoes(resultado);
});

async function init() {
  todasAcoes = await fetchAcoes();
  renderAcoes(todasAcoes);
}

init();
