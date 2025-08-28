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
// ───────── Dashboard Semanal ─────────
function startOfWeek(date) { const d=new Date(date); const day=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-day); return d; }
function endOfWeek(date) { const s=startOfWeek(date); const e=new Date(s); e.setDate(s.getDate()+6); e.setHours(23,59,59,999); return e; }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
function fmtDate(d){ return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});}
function fmtWeekday(d){ return d.toLocaleDateString('pt-BR',{weekday:'long'});}
function fmtTime(d){ if(!d) return ''; const hh=d.getHours(),mm=d.getMinutes(); return (hh+mm)!==0? d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'';}

let refDate = new Date();

function renderWeek() {
  const weekStart = startOfWeek(refDate);
  const weekEnd = endOfWeek(refDate);
  document.getElementById("weekRange").textContent =
    `${weekStart.toLocaleDateString("pt-BR",{day:"2-digit"})}/${(weekStart.getMonth()+1).toString().padStart(2,"0")} - ${fmtDate(weekEnd)}`;

  const tbody = document.getElementById("weekTableBody");
  tbody.innerHTML = "";

  const all = calendar.getEvents().map(ev => ({
    id: ev.id,
    title: ev.title,
    start: ev.start,
    end: ev.end || ev.start,
    status: (ev.extendedProps.status || "").toLowerCase(),
    location: ev.extendedProps.location || "",
  }));

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart); dayDate.setDate(weekStart.getDate()+i);

    const todays = all.filter(ev=>{
      const st=new Date(ev.start); st.setHours(0,0,0,0);
      const en=new Date(ev.end); en.setHours(23,59,59,999);
      const d0=new Date(dayDate); d0.setHours(12,0,0,0);
      return d0>=st && d0<=en;
    }).sort((a,b)=>a.start-b.start);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtWeekday(dayDate)}</td>
      <td>${dayDate.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}${sameDay(dayDate,new Date())? ' <span class="today">Hoje</span>': ''}</td>
      <td class="events-cell"></td>
    `;

    const cell = tr.querySelector(".events-cell");

    if (todays.length === 0) {
      cell.innerHTML = `<span class="week-empty">Nenhum evento</span>`;
    } else {
      todays.forEach(ev=>{
        const chip = document.createElement("div");
        chip.className = `event-chip status-${ev.status}`;
        chip.innerHTML = `
          <span class="status-dot"></span>
          <span>${ev.title}</span>
          <button class="view-more">Ver mais</button>
        `;
        chip.querySelector(".view-more").addEventListener("click",()=>{
          const fce = calendar.getEventById(ev.id);
          if (fce) {
            const event = fce;
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
          }
        });
        cell.appendChild(chip);
      });
    }
    tbody.appendChild(tr);
  }
}

document.getElementById("weekPrev").addEventListener("click",()=>{refDate.setDate(refDate.getDate()-7);renderWeek();});
document.getElementById("weekNext").addEventListener("click",()=>{refDate.setDate(refDate.getDate()+7);renderWeek();});



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

  renderWeek();
});