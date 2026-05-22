document.addEventListener("DOMContentLoaded", async function () {
  const lastUpdateEl = document.getElementById("last-update");
  const calendarEl = document.getElementById("calendar");
  const modalEl = document.getElementById("event-modal");
  const modalTitleEl = document.getElementById("modal-event-title");
  const modalStartEl = document.getElementById("modal-event-start");
  const modalEndEl = document.getElementById("modal-event-end");
  const modalLocationRowEl = document.getElementById(
    "modal-event-location-row",
  );
  const modalLocationEl = document.getElementById("modal-event-location");
  const modalCloseTargets = modalEl.querySelectorAll("[data-modal-close]");

  let events = [];
  let lastFocusedElement = null;

  function closeEventModal() {
    modalEl.classList.add("is-hidden");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function openEventModal(event) {
    lastFocusedElement = document.activeElement;

    modalTitleEl.textContent = event.title;
    modalStartEl.textContent = event.start.toLocaleString("fr-FR");
    modalEndEl.textContent = event.end.toLocaleString("fr-FR");

    const location = event.extendedProps.location || "";

    if (location) {
      modalLocationEl.textContent = location;
      modalLocationRowEl.style.display = "grid";
    } else {
      modalLocationEl.textContent = "";
      modalLocationRowEl.style.display = "none";
    }

    modalEl.classList.remove("is-hidden");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    modalEl.querySelector(".modal-close").focus();
  }

  modalCloseTargets.forEach((element) => {
    element.addEventListener("click", closeEventModal);
  });

  modalEl.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeEventModal();
    }
  });

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
    initialView: "dayGridMonth",

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
      openEventModal(info.event);
    },
  });

  calendar.render();

  setInterval(() => {
    location.reload();
  }, 300000);
});
