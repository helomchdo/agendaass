import { eventAPI } from '../../services/api.js';

console.log('[Monthly] script carregado');

document.addEventListener('DOMContentLoaded', async () => {
  // --- Helpers ---
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  // Modal helpers (preserve wrapper & close button)
  function openModalWithEvent(eventObj) {
    const detailsEl = qs('#eventDetails');
    if (!detailsEl) return;

    const startDate = eventObj.start ? new Date(eventObj.start) : null;
    if (startDate) startDate.setHours(0,0,0,0);
    const dateText = startDate ? startDate.toLocaleDateString('pt-BR') : 'N/A';
    const location = (eventObj.extendedProps && eventObj.extendedProps.location) || eventObj.location || 'N/A';
    const focal = (eventObj.extendedProps && eventObj.extendedProps.focal_point) || eventObj.focal_point || 'N/A';
    const sei = (eventObj.extendedProps && eventObj.extendedProps.sei) || eventObj.sei || 'N/A';
    const status = (eventObj.extendedProps && eventObj.extendedProps.status) || eventObj.status || 'N/A';

    detailsEl.innerHTML = `
      <h3>${(eventObj.title || 'Sem título')}</h3>
      <p><strong>Data:</strong> ${dateText}</p>
      <p><strong>Local:</strong> ${location}</p>
      <p><strong>Responsável:</strong> ${focal}</p>
      <p><strong>SEI:</strong> ${sei}</p>
      <p><strong>Status:</strong> ${status}</p>
      <div style="margin-top:12px; display:flex; gap:8px; justify-content:center;">
        <button class="btn-primary" id="editEventBtn">Editar</button>
        <button class="btn-secondary" id="closeEventBtn">Fechar</button>
      </div>
    `;

    const editBtn = qs('#editEventBtn');
    if (editBtn) editBtn.onclick = () => window.location.href = `/editar.html?id=${eventObj.id}`;

    const closeBtn = qs('#closeEventBtn');
    if (closeBtn) closeBtn.onclick = () => qs('#eventModal').style.display = 'none';

    qs('#eventModal').style.display = 'block';
  }

  // --- Calendar setup ---
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('[Monthly] Não achei <div id="calendar"> no HTML.');
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    eventClassNames(arg) { return arg.event.extendedProps.status?.toLowerCase() || ''; },
    eventClick(info) {
      // open modal using same helper (info.event is FullCalendar EventApi)
      openModalWithEvent(info.event);
    }
  });

  calendar.render();

  // Ensure modal close (wrapper X) works and clicking outside closes
  const modalWrapper = qs('#eventModal');
  const modalCloseX = qs('#eventModal .close');
  if (modalCloseX) modalCloseX.addEventListener('click', () => modalWrapper.style.display = 'none');
  if (modalWrapper) {
    modalWrapper.addEventListener('click', (ev) => {
      if (ev.target === modalWrapper) modalWrapper.style.display = 'none';
    });
  }

  // --- Load events once, map fields and populate calendar + weekly view ---
  let eventosSemana = [];
  try {
    const eventos = await eventAPI.getAllEvents();
    console.log('[Monthly] Eventos recebidos:', eventos);

    const eventosMapeados = eventos.map(ev => ({
      id: ev.id,
      title: ev.titulo || ev.title || "Sem título",
      start: ev.data_envio_gpac || ev.start,
      end: ev.data_fim || ev.end || ev.data_envio_gpac || ev.start,
      extendedProps: {
        status: ev.situacao || ev.status,
        sei: ev.seiNumber || ev.sei,
        location: ev.local || ev.location,
        focal_point: ev.focal_point || ev.responsavel
      }
    }));

    calendar.addEventSource(eventosMapeados);
    eventosSemana = eventosMapeados;
  } catch (err) {
    console.error('[Monthly] Falha ao carregar eventos:', err);
  }

  // --- Weekly view ---
  let currentWeekStart = new Date();

  function getWeekRange(date) {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // domingo
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23,59,59,999);
    return { start, end };
  }

  function renderWeeklyView() {
    const { start, end } = getWeekRange(currentWeekStart);
    const grid = document.getElementById("weeklyDaysGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const label = qs("#weekRangeLabel");
    if (label) label.textContent = `${start.toLocaleDateString("pt-BR")} - ${end.toLocaleDateString("pt-BR")}`;

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      day.setHours(0,0,0,0);

      const dayEvents = eventosSemana.filter(ev => {
        if (!ev.start) return false;
        // normalize date to local midnight to avoid timezone shifts
        const evDate = new Date(ev.start);
        evDate.setHours(0,0,0,0);
        return evDate.toDateString() === day.toDateString();
      });

      const eventsHTML = dayEvents.length
        ? dayEvents.map(ev => `
            <div class="weekly-event">
              <span>${ev.title}</span>
              <button class="btn-primary view-more-btn" data-id="${ev.id}">Ver Mais</button>
            </div>
          `).join("")
        : `<div class="no-event">Nenhum evento</div>`;

      grid.innerHTML += `
        <div class="weekly-day-col">
          <div class="weekly-day-label">
            ${day.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })}
            ${new Date().toDateString() === day.toDateString() ? '<span class="today-badge">Hoje</span>' : ''}
          </div>
          <div class="weekly-day-events">${eventsHTML}</div>
        </div>
      `;
    }
  }

  // navigation buttons
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");
  if (prevBtn) prevBtn.addEventListener('click', () => { currentWeekStart.setDate(currentWeekStart.getDate() - 7); renderWeeklyView(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { currentWeekStart.setDate(currentWeekStart.getDate() + 7); renderWeeklyView(); });

  // delegated listener for "Ver Mais" buttons in weekly view (works for dynamically created buttons)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('view-more-btn')) {
      const id = target.getAttribute('data-id');
      const evento = eventosSemana.find(ev => String(ev.id) === String(id));
      if (evento) openModalWithEvent(evento);
    }
  });

  // initial render
  renderWeeklyView();
});