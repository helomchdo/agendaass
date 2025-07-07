import { eventAPI } from '../../services/api.js';

// Debug logging
console.log('Monthly Dashboard Script Loaded');

document.addEventListener('DOMContentLoaded', function() {
    let calendar;
    let events = [];

    async function fetchEvents() {
        try {
            events = await eventAPI.getAllEvents();
            updateCalendarEvents();
        } catch (error) {
            console.error('Error fetching events:', error);
            alert('Falha ao carregar eventos. Por favor, tente novamente.');
        }
    }

    function updateCalendarEvents() {
        console.log('Updating calendar events...');
        console.log('Raw events:', events);

        const calendarEvents = events.map(event => {
            console.log('Processing event:', event);
            return {
                id: event.id,
                title: event.title || event.subject || 'Sem título', // Try both title and subject
                start: event.date,
                end: event.date,
                extendedProps: {
                    sei_number: event.sei_number,
                    location: event.location,
                    requester: event.requester,
                    focal_point: event.focal_point,
                    status: event.status,
                    send_date: event.send_date
                },
                backgroundColor: getEventColor(event.status)
            };
        });

        console.log('Transformed calendar events:', calendarEvents);

        calendar.removeAllEvents();
        calendar.addEventSource(calendarEvents);
        console.log('Calendar events updated');
    }

    function getEventColor(status) {
        const colors = {
            'PENDENTE': '#FFA500',     // Orange
            'APROVADO': '#22C55E',     // Green
            'REJEITADO': '#EF4444',    // Red
            'EM ANÁLISE': '#3B82F6',   // Blue
            'default': '#6B7280'       // Gray
        };
        return colors[status] || colors.default;
    }

    function initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana'
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
            datesSet: function(dateInfo) {
                // Re-fetch events when navigating months
                fetchEvents();
            }
        });

        calendar.render();
    }

    function showEventDetails(event) {
        const eventDate = new Date(event.start).toLocaleDateString('pt-BR');
        const details = `
            <div class="event-modal">
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p><strong>Data:</strong> ${eventDate}</p>
                    <p><strong>SEI:</strong> ${event.extendedProps.sei_number}</p>
                    <p><strong>Local:</strong> ${event.extendedProps.location}</p>
                    <p><strong>Solicitante:</strong> ${event.extendedProps.requester}</p>
                    <p><strong>Ponto Focal:</strong> ${event.extendedProps.focal_point}</p>
                    <p><strong>Status:</strong> <span class="status-${event.extendedProps.status.toLowerCase()}">${event.extendedProps.status}</span></p>
                    <p><strong>Data de Envio:</strong> ${new Date(event.extendedProps.send_date).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
        `;

        // Use a custom modal or dialog component instead of alert
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = details;
        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    initializeCalendar();
    fetchEvents();
});
