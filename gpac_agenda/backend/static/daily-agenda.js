import { eventAPI } from '../../services/api.js';

console.log('Daily Agenda Script Loaded');

document.addEventListener("DOMContentLoaded", () => {
    const prevDayBtn = document.getElementById("prevDay");
    const nextDayBtn = document.getElementById("nextDay");
    const currentDateElem = document.querySelector(".current-date");
    const eventCountElem = document.querySelector(".daily-title span");
    const noEventsContainer = document.querySelector(".no-events-container");
    const eventsContainer = document.querySelector(".events-container");

    let currentDate = new Date();
    let events = [];

    function formatDate(date) {
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function renderEvents(dayEvents) {
    if (dayEvents.length === 0) {
        noEventsContainer.style.display = "block";
        eventsContainer.style.display = "none";
    } else {
        noEventsContainer.style.display = "none";
        eventsContainer.style.display = "block";
        eventsContainer.innerHTML = dayEvents.map(event => `
            <div class="event-card">
                <div class="event-header">
                    <h3>${event.title || event.assunto || 'Sem título'}</h3>
                    <span class="event-status ${event.situacao?.toLowerCase() || 'desconhecido'}">
                        ${event.situacao || 'Sem status'}
                    </span>
                </div>
                <div class="event-details">
                    <p><strong>Data:</strong> ${event.date || event.start || '-'}</p>
                    <p><strong>Local:</strong> ${event.local || '-'}</p>
                    <p><strong>Solicitante:</strong> ${event.solicitante || '-'}</p>
                    <p><strong>Ponto Focal:</strong> ${event.ponto_focal || '-'}</p>
                </div>
            </div>
        `).join('');
    }
}

    async function fetchEvents() {
        try {
            events = await eventAPI.getAllEvents();
            updateUI(currentDate);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            alert("Falha ao carregar eventos. Por favor, tente novamente.");
        }
    }

    function updateUI(date) {
        console.log('Updating UI for date:', date);
        const isoDate = date.toISOString().split("T")[0];
        console.log('ISO date for filtering:', isoDate);
        console.log('Available events:', events);

        const dayEvents = events.filter(event => {
            const evDate = event.date || event.start;
            console.log('Comparing event date:', evDate, 'with isoDate:', isoDate);
            return evDate === isoDate;
        });

        console.log('Filtered events for the day:', dayEvents);

        const isToday = date.toDateString() === new Date().toDateString();

        const formattedDate = formatDate(date);
        currentDateElem.textContent = `${formattedDate}${isToday ? ' (Hoje)' : ''}`;
        eventCountElem.textContent = `(${dayEvents.length} eventos)`;

        const noEventsSubmessage = document.querySelector(".no-events-submessage");
        if (noEventsSubmessage) {
            const day = date.getDate();
            const month = date.toLocaleDateString("pt-BR", { month: "long" });
            noEventsSubmessage.textContent = `Não há eventos para ${day} de ${month}.`;
        }

        renderEvents(dayEvents);
    }

    prevDayBtn.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateUI(currentDate);
    });

    nextDayBtn.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateUI(currentDate);
    });

    fetchEvents();
});
