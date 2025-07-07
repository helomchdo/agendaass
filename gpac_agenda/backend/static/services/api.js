
import { getAuthHeader } from './auth.js';

const BASE = '/api/solicitacoes';   // todas as rotas do back‑end Flask

export const eventAPI = {
  // ---------- LISTAR ----------
  async getAllEvents(params = '') {
    // params pode ser algo como '?start=2025-07-01&end=2025-07-31'
    const resp = await fetch(`${BASE}${params}`, {
      headers: { ...getAuthHeader() }
    });
    if (!resp.ok) throw await resp.json();
    const data = await resp.json();
    return data.map(mapToCalendar);
  },

  // alias (caso outras partes chamem getAll)
  async getAll(params = '') {
    return this.getAllEvents(params);
  },

  // ---------- CRIAR ----------
  async create(evento) {
    const resp = await fetch(BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(evento)
    });
    if (!resp.ok) throw await resp.json();
    return mapToCalendar(await resp.json());
  },

  // ---------- ATUALIZAR ----------
  async update(id, data) {
    const resp = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  },

  // ---------- DELETAR ----------
  async remove(id) {
    const resp = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!resp.ok) throw await resp.json();
    return await resp.json();
  }
};

// ----------------- MAPEAMENTO -----------------
function mapToCalendar(ev) {
  return {
    id: ev.id,
    title: ev.assunto,           // título / assunto do evento
    date: ev.data_evento,        // ISO string YYYY‑MM‑DD
    start: ev.data_evento,
    end: ev.data_evento,
    location: ev.local,
    status: ev.situacao,
    focal_point: ev.ponto_focal,
    seiNumber: ev.sei,
    sendDate: ev.data_envio_gi,
    requester: ev.solicitante
  };
}
