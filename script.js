document.addEventListener('DOMContentLoaded', async function () {

  const response = await fetch(
    './events.json?t=' + new Date().getTime()
  )
  const events = await response.json()

  document.getElementById('last-update').textContent =
    new Date().toLocaleString('fr-FR')

  const calendarEl = document.getElementById('calendar')

      const categoryColors = {
        "y": "#005c7e",
        "x": "#00bcd4",
        "Conseil": "#9c27b0",
        "Commission": "#f44336",
        "Bureau": "#ff9800",
        "Bureauc": "#8bc34a"
    }

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: window.innerWidth < 768
      ? 'listMonth'
      : 'dayGridMonth',

    locale: 'fr',

    firstDay: 1,

    height: 'auto',

    nowIndicator: true,

    displayEventTime: true,

    eventDisplay: 'block',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listMonth'
    },

    buttonText: {
      today: 'Aujourd’hui',
      month: 'Mois',
      week: 'Semaine',
      list: 'Liste'
    },

    events: events,

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },

    eventDidMount: function(info) {

    const category =
        info.event.extendedProps.category

    const color =
        categoryColors[category] || "#00bcd4"

    info.el.style.backgroundColor = color
    },

    eventContent: function(arg) {

      const location =
        arg.event.extendedProps.location || ''

      const time =
        arg.timeText || ''

      return {
        html: `
          <div class="event-content">
            <div class="event-time">${time}</div>
            <div class="event-title">
              ${arg.event.title}
            </div>
            <div class="event-location">
              ${location}
            </div>
          </div>
        `
      }
    },

    eventClick: function(info) {

      let details = `
${info.event.title}

Début : ${info.event.start.toLocaleString()}
Fin : ${info.event.end.toLocaleString()}
      `

      if (info.event.extendedProps.location) {

        details += `

Lieu : ${info.event.extendedProps.location}`
      }

      alert(details)
    }

  })

  calendar.render()

  // Refresh auto toutes les 5 minutes
  setInterval(() => {
    location.reload()
  }, 300000)

})