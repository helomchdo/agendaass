const listaAcoes = document.getElementById('lista-acoes');

const filterByTextBtn = document.getElementById('filterByText');
const filterByDateBtn = document.getElementById('filterByDate');

const textFilters = document.getElementById('textFilters');
const dateFilters = document.getElementById('dateFilters');

const loading = document.getElementById('loading');

async function fetchAcoes() {
  try {
    loading.classList.remove('hidden');
    const response = await fetch('/api/solicitacoes');
    if (!response.ok) throw new Error('Failed to fetch actions');
    const data = await response.json();

    return data.map(item => ({
      numSei: item.sei,
      dataEnvio: item.data_envio_gpac?.split('T')[0],
      assunto: item.assunto,
      solicitante: item.solicitante,
      local: item.local,
      pontoFocal: item.ponto_focal,
      data: item.data_evento,
      situacao: item.situacao,
      seiSolicitacao: item.sei_diarias
    }));
  } catch (error) {
    const errorMsg = 'Erro ao carregar ações. Por favor, tente novamente.';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
    errorDiv.innerHTML = `<span class="block sm:inline">${errorMsg}</span>`;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    console.error(error);
    return [];
  } finally {
    loading.classList.add('hidden');
  }
}

function renderizarLista(lista) {
  listaAcoes.innerHTML = '';

  if (lista.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-results';
    li.innerHTML = `<i class="fas fa-search"></i><p>Nenhuma ação encontrada</p>`;
    listaAcoes.appendChild(li);
    return;
  }

  lista.forEach(acao => {
    const li = document.createElement('li');
    li.className = 'action-item';

    const fields = [
      { label: 'Número SEI', value: acao.numSei },
      { label: 'Data de envio', value: acao.dataEnvio },
      { label: 'Assunto', value: acao.assunto },
      { label: 'Solicitante', value: acao.solicitante },
      { label: 'Local', value: acao.local },
      { label: 'Ponto Focal', value: acao.pontoFocal },
      { label: 'Data', value: acao.data },
      { label: 'Situação', value: acao.situacao },
      { label: 'SEI Solicitação', value: acao.seiSolicitacao || '-' }
    ];

    li.innerHTML = fields.map(f =>
      `<div class="action-field"><span class="field-label">${f.label}:</span> ${f.value || '-'}</div>`
    ).join('');

    listaAcoes.appendChild(li);
  });
}

function filtrarAcoes(acoes) {
  let filtradas = [];

  if (textFilters.style.display !== 'none') {
    const numSeiVal = document.getElementById('filtro-num-sei').value.trim().toLowerCase();
    const assuntoVal = document.getElementById('filtro-assunto').value.trim().toLowerCase();
    const solicitanteVal = document.getElementById('filtro-solicitante').value.trim().toLowerCase();
    const localVal = document.getElementById('filtro-local').value.trim().toLowerCase();
    const pontoFocalVal = document.getElementById('filtro-ponto-focal').value.trim().toLowerCase();

    filtradas = acoes.filter(acao => (
      (!numSeiVal || acao.numSei?.toLowerCase().includes(numSeiVal)) &&
      (!assuntoVal || acao.assunto?.toLowerCase().includes(assuntoVal)) &&
      (!solicitanteVal || acao.solicitante?.toLowerCase().includes(solicitanteVal)) &&
      (!localVal || acao.local?.toLowerCase().includes(localVal)) &&
      (!pontoFocalVal || acao.pontoFocal?.toLowerCase().includes(pontoFocalVal))
    ));
  } else {
    const dataEnvioVal = document.getElementById('filtro-data-envio').value;
    const dataVal = document.getElementById('filtro-data').value;
    const situacaoVal = document.getElementById('filtro-situacao').value;
    const seiSolicitacaoVal = document.getElementById('filtro-sei-solicitacao').value.trim().toLowerCase();

    filtradas = acoes.filter(acao => (
      (!dataEnvioVal || acao.dataEnvio === dataEnvioVal) &&
      (!dataVal || acao.data === dataVal) &&
      (!situacaoVal || acao.situacao === situacaoVal) &&
      (!seiSolicitacaoVal || acao.seiSolicitacao?.toLowerCase().includes(seiSolicitacaoVal))
    ));
  }

  renderizarLista(filtradas);
}

let acoes = [];

filterByTextBtn.addEventListener('click', () => {
  filterByTextBtn.classList.add('active', 'btn-primary');
  filterByTextBtn.classList.remove('btn-secondary');
  filterByDateBtn.classList.remove('active', 'btn-primary');
  filterByDateBtn.classList.add('btn-secondary');
  textFilters.classList.remove('hidden');
  dateFilters.classList.add('hidden');
  filtrarAcoes(acoes);
});

filterByDateBtn.addEventListener('click', () => {
  filterByDateBtn.classList.add('active', 'btn-primary');
  filterByDateBtn.classList.remove('btn-secondary');
  filterByTextBtn.classList.remove('active', 'btn-primary');
  filterByTextBtn.classList.add('btn-secondary');
  dateFilters.classList.remove('hidden');
  textFilters.classList.add('hidden');
  filtrarAcoes(acoes);
});

document.getElementById('filtrar-botao').addEventListener('click', () => {
  loading.classList.remove('hidden');
  filtrarAcoes(acoes);
  loading.classList.add('hidden');
});

async function init() {
  acoes = await fetchAcoes();
  filtrarAcoes(acoes);
}

init();

window.filtrarAcoes = filtrarAcoes;
window.acoes = acoes;
