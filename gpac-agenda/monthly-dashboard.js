document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const eventTypeFilter = document.getElementById("eventTypeFilter");
  const locationFilter = document.getElementById("locationFilter");
  const focalPointFilter = document.getElementById("focalPointFilter");

  // Sample events data
  const allEvents = [
    {
      id: "1",
      title: "Reunião de equipe",
      start: "2025-06-03T10:00:00",
      end: "2025-06-03T11:00:00",
      type: "reuniao",
      location: "sala1",
      focalPoint: "usuario1",
    },
    {
      id: "2",
      title: "Apresentação do projeto",
      start: "2025-06-07T14:00:00",
      end: "2025-06-07T15:00:00",
      type: "apresentacao",
      location: "sala2",
      focalPoint: "usuario2",
    },
    {
      id: "3",
      title: "Visita ao cliente",
      start: "2025-06-15T09:00:00",
      end: "2025-06-15T12:00:00",
      type: "visita",
      location: "sala1",
      focalPoint: "usuario1",
    },
  ];

  let calendar;

  function filterEvents() {
    const type = eventTypeFilter.value;
    const location = locationFilter.value;
    const focalPoint = focalPointFilter.value;

    return allEvents.filter((event) => {
      return (
        (type === "" || event.type === type) &&
        (location === "" || event.location === location) &&
        (focalPoint === "" || event.focalPoint === focalPoint)
      );
    });
  }

  function renderCalendar() {
    if (calendar) {
      calendar.destroy();
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      locale: "pt-br",
      events: filterEvents(),
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
    });

    calendar.render();
  }

  eventTypeFilter.addEventListener("change", renderCalendar);
  locationFilter.addEventListener("change", renderCalendar);
  focalPointFilter.addEventListener("change", renderCalendar);

  renderCalendar();
});
