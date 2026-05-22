document.addEventListener("DOMContentLoaded", async function () {
  const lastUpdateEl = document.getElementById("last-update");
  const calendarEl = document.getElementById("calendar");

  let events = [];

  try {
    const response = await fetch("./events.json?t=" + new Date().getTime());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    events = Array.isArray(data.events) ? data.events : [];

    lastUpdateEl.textContent = new Date(data.generatedAt).toLocaleString(
      "fr-FR",
    );
  } catch (error) {
    console.error("Impossible de charger events.json", error);
    lastUpdateEl.textContent = "indisponible";
    calendarEl.innerHTML =
      '<p class="calendar-error">Impossible de charger les evenements.</p>';
    return;
  }

  const categoryColors = {
    y: "#005c7e",

    Conseil: "#9c27b0",

    Commission: "#f44336",

    x: "#00bcd4",

    Bureauc: "#8bc34a",

    Bureau: "#ff9800",
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: window.innerWidth < 768 ? "listMonth" : "dayGridMonth",

    locale: "fr",

    firstDay: 1,

    height: "auto",

    nowIndicator: true,

    displayEventTime: true,

    eventDisplay: "block",

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,listMonth",
    },

    buttonText: {
      today: "Aujourd’hui",
      month: "Mois",
      week: "Semaine",
      list: "Liste",
    },

    events: events,

    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },

    eventDidMount: function (info) {
      const category = info.event.extendedProps.category;

      const color = categoryColors[category] || "#00bcd4";

      info.el.style.backgroundColor = color;
    },

    eventContent: function (arg) {
      const location = arg.event.extendedProps.location || "";

      const time = arg.timeText || "";

      const wrapper = document.createElement("div");
      wrapper.className = "event-content";

      const timeEl = document.createElement("div");
      timeEl.className = "event-time";
      timeEl.textContent = time;

      const titleEl = document.createElement("div");
      titleEl.className = "event-title";
      titleEl.textContent = arg.event.title;

      wrapper.append(timeEl, titleEl);

      if (location) {
        const locationEl = document.createElement("div");
        locationEl.className = "event-location";
        locationEl.textContent = location;

        wrapper.append(locationEl);
      }

      return { domNodes: [wrapper] };
    },

    eventClick: function (info) {
      let details = `
${info.event.title}

Début : ${info.event.start.toLocaleString("fr-FR")}
Fin : ${info.event.end.toLocaleString("fr-FR")}
      `;

      if (info.event.extendedProps.location) {
        details += `

Lieu : ${info.event.extendedProps.location}`;
      }

      alert(details);
    },
  });

  calendar.render();

  setInterval(() => {
    location.reload();
  }, 300000);
});
