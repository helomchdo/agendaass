import { eventAPI } from '../../services/api.js';  
console.log('[Monthly] script carregado');

document.addEventListener('DOMContentLoaded', async () => {
  // === Monthly Calendar ===
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('[Monthly] Não achei <div id="calendar"> no HTML.');
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    eventClassNames(arg) {
      return arg.event.extendedProps.status?.toLowerCase() || '';
    },
    eventClick: function (info) {
      const event = info.event;
      const detailsHTML = `
        <h3>${event.title}</h3>
        <p><strong>Data:</strong> ${event.start.toLocaleDateString()}</p>
        <p><strong>Local:</strong> ${event.extendedProps.location || 'N/A'}</p>
        <p><strong>Responsável:</strong> ${event.extendedProps.focal_point || 'N/A'}</p>
        <p><strong>SEI:</strong> ${event.extendedProps.sei || 'N/A'}</p>
        <button class="btn-primary" id="editEventBtn">Editar</button>
      `;
      document.getElementById("eventDetails").innerHTML = detailsHTML;
      document.getElementById("eventModal").style.display = "block";

      document.getElementById("editEventBtn").onclick = () => {
        window.location.href = `/editar.html?id=${event.id}`;
      };
    }
  });

  calendar.render();

  // Carregar eventos e mapear campos
  let eventosSemana = [];
  try {
    const eventos = await eventAPI.getAllEvents();
    console.log('[Monthly] Eventos recebidos:', eventos);

    // Mapeamento dos campos do backend para o formato esperado
    const eventosMapeados = eventos.map(ev => ({
      id: ev.id,
      title: ev.titulo || ev.title || "Sem título",
      start: ev.data_envio_gpac || ev.start, // ajuste conforme seu backend
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

  // === Weekly Agenda ===
  let currentWeekStart = new Date();

  function getWeekRange(date) {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // domingo
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // sábado
    return { start, end };
  }

 function renderWeeklyView() {
  const { start, end } = getWeekRange(currentWeekStart);
  const grid = document.getElementById("weeklyDaysGrid");
  if (!grid) return;
  grid.innerHTML = "";

  document.getElementById("weekRangeLabel").textContent =
    `${start.toLocaleDateString("pt-BR")} - ${end.toLocaleDateString("pt-BR")}`;

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const dayEvents = eventosSemana.filter(ev => {
      if (!ev.start) return false;
      const evDate = new Date(ev.start);
      return evDate.toDateString() === day.toDateString();
    });

    const eventsHTML = dayEvents.length
      ? dayEvents.map(ev => `
          <div class="weekly-event">
            <span>${ev.title}</span>
            <button onclick="window.location.href='/editar.html?id=${ev.id}'">Editar</button>
          </div>
        `).join("")
      : `<span style="color:#666; font-size:0.85rem;">Nenhum evento</span>`;

    grid.innerHTML += `
      <div class="weekly-day-col">
        <div class="weekly-day-label">
          ${day.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })}
          ${new Date().toDateString() === day.toDateString() ? '<span class="today-badge">Hoje</span>' : ''}
        </div>
        <div class="weekly-day-events">
          ${eventsHTML}
        </div>
      </div>
    `;
  }
}
  // Weekly navigation buttons
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      renderWeeklyView();
    };

    nextBtn.onclick = () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      renderWeeklyView();
    };
  }

  // Renderizar a visão semanal após carregar os eventos
  renderWeeklyView();
});