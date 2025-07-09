
import { eventAPI } from '../../services/api.js';  
console.log('[Monthly] script carregado');

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Encontra o container existente
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error('[Monthly] Não achei <div id="calendar"> no HTML.');
    return;
  }

  // 2. Instancia o FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    // opcional: estilizar eventos depois
    eventClassNames(arg) {
      return arg.event.extendedProps.status?.toLowerCase() || '';
    }
  });

  calendar.render();

  // 3. Busca eventos do back-end
  try {
    const eventos = await eventAPI.getAllEvents();   // já devolve mapeado
    console.log('[Monthly] Eventos recebidos:', eventos);

    // FullCalendar aceita start/end em ISO
    calendar.addEventSource(eventos.map(ev => ({
      id: ev.id,
      title: ev.title,
      start: ev.start,          // ex.: 2025-07-10 ou 2025-07-10T09:00
      end:   ev.end,            // opcional
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
