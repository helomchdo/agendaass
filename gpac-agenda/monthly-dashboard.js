import { eventAPI } from './services/api.js';

document.addEventListener('DOMContentLoaded', function() {
  let calendar;
  let events = [];
  
  // Initialize statistics
  const statsElements = {
    totalEvents: document.getElementById('totalEvents'),
    todayEvents: document.getElementById('todayEvents'),
    totalParticipants: document.getElementById('totalParticipants')
  };

  // Initialize filters
  const filters = {
    eventType: document.getElementById('eventTypeFilter'),
    location: document.getElementById('locationFilter'),
    focalPoint: document.getElementById('focalPointFilter')
  };

  // Add event listeners to filters
  Object.values(filters).forEach(filter => {
    filter.addEventListener('change', updateCalendarEvents);
  });

  async function fetchEvents() {
    try {
      events = await eventAPI.getAllEvents();
      updateStatistics();
      updateCalendarEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events. Please try again.');
    }
  }

  function updateStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.date_time);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });

    const totalParticipants = events.reduce((total, event) => {
      const participantCount = event.participants ? event.participants.split(',').length : 0;
      return total + participantCount;
    }, 0);

    statsElements.totalEvents.textContent = events.length;
    statsElements.todayEvents.textContent = todayEvents.length;
    statsElements.totalParticipants.textContent = totalParticipants;
  }

  function updateCalendarEvents() {
    const filteredEvents = events.filter(event => {
      const typeMatch = !filters.eventType.value || event.type === filters.eventType.value;
      const locationMatch = !filters.location.value || event.location === filters.location.value;
      const focalPointMatch = !filters.focalPoint.value || 
        (event.participants && event.participants.includes(filters.focalPoint.value));
      
      return typeMatch && locationMatch && focalPointMatch;
    });

    const calendarEvents = filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.date_time,
      end: event.date_time,
      extendedProps: {
        location: event.location,
        description: event.description,
        participants: event.participants,
        reminders: event.reminders
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
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonText: {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia'
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
      },
      eventDidMount: function(info) {
        info.el.setAttribute('data-tooltip', info.event.title);
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
      <p><strong>Local:</strong> ${event.extendedProps.location}</p>
      ${event.extendedProps.description ? `<p><strong>Descrição:</strong> ${event.extendedProps.description}</p>` : ''}
      ${event.extendedProps.participants ? `<p><strong>Participantes:</strong> ${event.extendedProps.participants}</p>` : ''}
      ${event.extendedProps.reminders ? `<p><strong>Lembretes:</strong> ${event.extendedProps.reminders}</p>` : ''}
    `;

    // You can implement your own modal or use a library like SweetAlert2
    alert(details); // Replace this with a better modal implementation
  }

  // Initialize calendar and fetch events
  initializeCalendar();
  fetchEvents();
});
