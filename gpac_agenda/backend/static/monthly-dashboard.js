import { eventAPI } from '../../services/api.js';  
console.log('[Monthly] script carregado');

document.addEventListener('DOMContentLoaded', async () => {
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
  }); // fecha a configuração do calendário

  calendar.render();

  try {
    const eventos = await eventAPI.getAllEvents();
    console.log('[Monthly] Eventos recebidos:', eventos);

    calendar.addEventSource(eventos.map(ev => ({
      id: ev.id,
      title: ev.title,
      start: ev.start,
      end: ev.end,
      extendedProps: {
        status: ev.status,
        sei: ev.seiNumber,
        location: ev.location,
        focal_point: ev.focal_point
      }
    })));
  } catch (err) {
    console.error('[Monthly] Falha ao carregar eventos:', err);
  }
  // ===== Weekly View independente =====
let eventosSemana = [];
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
  const tbody = document.getElementById("weeklyTableBody");
  tbody.innerHTML = "";

  document.getElementById("weekRangeLabel").textContent =
    `${start.toLocaleDateString("pt-BR")} - ${end.toLocaleDateString("pt-BR")}`;

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    const dayEvents = eventosSemana.filter(ev => {
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

    tbody.innerHTML += `
      <tr>
        <td>${day.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })} 
          ${new Date().toDateString() === day.toDateString() ? '<span class="today-badge">Hoje</span>' : ''}
        </td>
        <td>${eventsHTML}</td>
      </tr>`;
  }
}

// Navegação
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("prevWeek").onclick = () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeeklyView();
  };

  document.getElementById("nextWeek").onclick = () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeeklyView();
  };

  try {
    eventosSemana = await eventAPI.getAllEvents();
    renderWeeklyView();
  } catch (err) {
    console.error("[Weekly] Falha ao carregar eventos:", err);
  }
});

}); // fecha o DOMContentLoaded
