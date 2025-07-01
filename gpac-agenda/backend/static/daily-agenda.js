import { eventAPI } from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const prevDayBtn = document.getElementById("prevDay");
  const nextDayBtn = document.getElementById("nextDay");
  const currentDateElem = document.querySelector(".current-date");
  const eventCountElem = document.querySelector(".daily-title span");
  const noEventsContainer = document.querySelector(".no-events-container");

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
    } else {
      noEventsContainer.style.display = "none";
      // You can extend this to render event details in a list or cards
      // For now, just update the event count
    }
  }

  async function fetchEvents() {
    try {
      events = await eventAPI.getAllEvents();
      updateUI(currentDate);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Falha ao carregar eventos. Por favor, tente novamente.");
    }
  }

  function updateUI(date) {
    const isoDate = date.toISOString().split("T")[0];
    const dayEvents = events.filter(event => event.dateTime.startsWith(isoDate));
    const isToday = date.toDateString() === new Date().toDateString();

    // Update date display
    currentDateElem.textContent = `${formatDate(date)}${isToday ? ' (Hoje)' : ''}`;

    // Update event count
    eventCountElem.textContent = `(${dayEvents.length} eventos)`;

    // Update no events message if needed
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

  // Initial fetch and render
  fetchEvents();
});
