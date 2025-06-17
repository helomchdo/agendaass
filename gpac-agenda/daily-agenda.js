document.addEventListener("DOMContentLoaded", () => {
  const agendaList = document.getElementById("agendaList");
  const currentDateElem = document.getElementById("currentDate");
  const emptyState = document.getElementById("emptyState");
  const prevDayBtn = document.getElementById("prevDay");
  const nextDayBtn = document.getElementById("nextDay");

  let currentDate = new Date();

  function formatDate(date) {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
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

  function renderAgenda(date) {
    const isoDate = date.toISOString().split("T")[0];
    currentDateElem.textContent = formatDate(date);
    agendaList.innerHTML = "";

    const dayEvents = events[isoDate] || [];

    if (dayEvents.length === 0) {
      emptyState.style.display = "block";
      agendaList.style.display = "none";
    } else {
      emptyState.style.display = "none";
      agendaList.style.display = "block";

      dayEvents.forEach((event) => {
        const li = document.createElement("li");
        li.className = "agenda-item";

        const timeSpan = document.createElement("span");
        timeSpan.className = "agenda-time";
        timeSpan.textContent = event.time;

        const descSpan = document.createElement("span");
        descSpan.className = "agenda-description";
        descSpan.textContent = event.description;

        li.appendChild(timeSpan);
        li.appendChild(descSpan);

        // Highlight events within next hour
        const now = new Date();
        const eventDateTime = new Date(date);
        const [hours, minutes] = event.time.split(":");
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const diffMinutes = (eventDateTime - now) / 60000;
        if (diffMinutes >= 0 && diffMinutes <= 60) {
          li.classList.add("highlight");
        }

        agendaList.appendChild(li);
      });
    }
  }

  prevDayBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    renderAgenda(currentDate);
  });

  nextDayBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    renderAgenda(currentDate);
  });

  renderAgenda(currentDate);
});
