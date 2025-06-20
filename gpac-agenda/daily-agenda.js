document.addEventListener("DOMContentLoaded", () => {
  const prevDayBtn = document.getElementById("prevDay");
  const nextDayBtn = document.getElementById("nextDay");
  const currentDateElem = document.querySelector(".current-date");
  const eventCountElem = document.querySelector(".daily-title span");

  let currentDate = new Date();

  function formatDate(date) {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Sample events data (replace with real data or API)
  const events = {
    // ISO date string: array of events
    "2025-06-17": [
      { time: "09:00", description: "Reunião com equipe" },
      { time: "14:30", description: "Apresentação do projeto" },
    ],
    "2025-06-18": [
      { time: "10:00", description: "Visita ao cliente" },
    ],
  };

  function updateUI(date) {
    const isoDate = date.toISOString().split("T")[0];
    const dayEvents = events[isoDate] || [];
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
  }

  prevDayBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateUI(currentDate);
  });

  nextDayBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateUI(currentDate);
  });

  // Initial render
  updateUI(currentDate);
});
