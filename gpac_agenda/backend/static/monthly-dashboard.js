import { eventAPI } from '../../services/api.js';  
console.log ('[Monthly] script carregado');

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
    eventClick: function(info) {
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
},

  });

  calendar.render();
let refDate = new Date();

  const weekRangeEl = document.getElementById("weekRange");
  const weeklyBody = document.getElementById("weeklyBody");

  function startOfWeek(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // segunda-feira como início
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function endOfWeek(date) {
    const d = startOfWeek(date);
    const e = new Date(d);
    e.setDate(d.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  }

  function formatDate(d) {
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  function formatWeekday(d) {
    return d.toLocaleDateString("pt-BR", { weekday: "long" });
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  let allEvents = [];

  async function loadEvents() {
    try {
      const res = await fetch("/api/solicitacoes");
      if (!res.ok) throw new Error("Falha ao carregar eventos");
      const data = await res.json();

      // Normaliza os eventos vindos do backend
      allEvents = data.map(ev => ({
        id: ev.id,
        title: ev.titulo || ev.title || "Sem título",
        date: new Date(ev.data_evento || ev.start || ev.data_envio_gpac),
        location: ev.local || ev.location || "",
        status: ev.situacao || ev.status || ""
      }));

      renderWeek();
    } catch (err) {
      console.error("[Weekly] Erro ao buscar eventos:", err);
      weeklyBody.innerHTML = `<tr><td colspan="3">Erro ao carregar eventos</td></tr>`;
    }
  }

  function renderWeek() {
    const weekStart = startOfWeek(refDate);
    const weekEnd = endOfWeek(refDate);

    weekRangeEl.textContent = `${formatDate(weekStart)} - ${weekEnd.toLocaleDateString("pt-BR")}`;
    weeklyBody.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${formatWeekday(dayDate)}</strong></td>
        <td>
          ${formatDate(dayDate)}
          ${sameDay(dayDate, new Date()) ? '<span class="today-badge">Hoje</span>' : ""}
        </td>
        <td class="events-cell"></td>
      `;

      const eventsForDay = allEvents.filter(ev => sameDay(new Date(ev.date), dayDate));

      const cell = tr.querySelector(".events-cell");
      if (eventsForDay.length === 0) {
        cell.innerHTML = `<em style="opacity:.6">Nenhum evento</em>`;
      } else {
        eventsForDay.forEach(ev => {
          const div = document.createElement("div");
          div.className = "event-item";
          div.innerHTML = `
            <span>${ev.title}</span>
            <button data-id="${ev.id}">Ver</button>
          `;
          div.querySelector("button").addEventListener("click", () => {
            alert(`Evento: ${ev.title}\nData: ${ev.date.toLocaleDateString("pt-BR")}\nLocal: ${ev.location || "N/A"}\nStatus: ${ev.status}`);
          });
          cell.appendChild(div);
        });
      }

      weeklyBody.appendChild(tr);
    }
  }

  try {
    const eventos = await eventAPI.getAllEvents();
    console.log('[Monthly] Eventos recebidos:', eventos);

    calendar.addEventSource(eventos.map(ev => ({
      id: ev.id,
      title: ev.title,
      start: ev.start,
      end:   ev.end,
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

 
});