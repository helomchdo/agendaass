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

  document.querySelector(".modal .close").addEventListener("click", () => {
  document.getElementById("eventModal").style.display = "none";
});


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