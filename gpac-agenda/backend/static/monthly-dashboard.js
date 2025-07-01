import { eventAPI } from './services/api.js';

document.addEventListener('DOMContentLoaded', function() {
  let calendar;
  let events = [];

  async function fetchEvents() {
    try {
      events = await eventAPI.getAllEvents();
      updateCalendarEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events. Please try again.');
    }
  }

  function updateCalendarEvents() {
    const calendarEvents = events.map(event => ({
      id: event.id,
      title: event.subject || event.title || 'Evento',
      start: event.date || event.date_time,
      end: event.date || event.date_time,
      extendedProps: {
        location: event.location,
        description: event.description,
        participants: event.participants,
        status: event.status
      },
      backgroundColor: getEventColor(event.type)
    }));

    calendar.removeAllEvents();
    calendar.addEventSource(calendarEvents);
  }

  function getEventColor(eventType) {
    const colors = {
      reuniao: '#3b82f6',      // Blue
      apresentacao: '#10b981',  // Green
      visita: '#8b5cf6',       // Purple
      default: '#6b7280'       // Gray
    };
    return colors[eventType] || colors.default;
  }

  function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'Hoje',
        month: 'Mês'
      },
      locale: 'pt-br',
      firstDay: 0,
      weekNumbers: true,
      weekNumberFormat: { week: 'numeric' },
      dayMaxEvents: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      eventClick: function(info) {
        showEventDetails(info.event);
      }
    });

    calendar.render();
  }

  function showEventDetails(event) {
    const eventTime = new Date(event.start).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const details = `
      <h3>${event.title}</h3>
      <p><strong>Horário:</strong> ${eventTime}</p>
      <p><strong>Local:</strong> ${event.extendedProps.location || 'N/A'}</p>
      ${event.extendedProps.description ? `<p><strong>Descrição:</strong> ${event.extendedProps.description}</p>` : ''}
      ${event.extendedProps.participants ? `<p><strong>Participantes:</strong> ${event.extendedProps.participants}</p>` : ''}
      ${event.extendedProps.status ? `<p><strong>Situação:</strong> ${event.extendedProps.status}</p>` : ''}
    `;

    alert(details); // Replace with a better modal if desired
  }

  initializeCalendar();
  fetchEvents();
});
