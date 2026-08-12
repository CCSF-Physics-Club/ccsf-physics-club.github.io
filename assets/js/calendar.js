let events = JSON.parse(document.getElementById('events-data').textContent);
if (typeof events === 'string') {
  events = JSON.parse(events);
}

const calendarEl = document.getElementById('calendar');

function getEventStyle(title) {
  if (title === 'General Club Meeting') {
    return { label: 'GA Meeting', color: '#fc79b0' };
  }
  if (title === 'Weekly Study Group') {
    return { label: 'Study Group', color: '#cafc79' };
  }
  if (title === 'Unity Day') {
    return { label: 'Unity Day', color: '#e02e2d' };
  }
  return { label: title, color: '#dddddd' };
}

const eventsByDate = {};
events.forEach(e => {
  if (!eventsByDate[e.date]) {
    eventsByDate[e.date] = [];
  }
  eventsByDate[e.date].push(e);
});

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let tooltipEl = null;

function showTooltip(cell, dayEvents) {
  hideTooltip();
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'calendar-tooltip';
  tooltipEl.innerHTML = dayEvents.map(e =>
    `<div class="tooltip-event"><strong>${e.title}</strong><br>${e.time} &mdash; ${e.location}</div>`
  ).join('');
  document.body.appendChild(tooltipEl);

  const rect = cell.getBoundingClientRect();
  tooltipEl.style.left = `${rect.left + window.scrollX}px`;
  tooltipEl.style.top = `${rect.bottom + window.scrollY + 6}px`;
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}

function renderCalendar(month, year) {
  calendarEl.innerHTML = '';

  const monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `
    <button id="prevMonth">&#8592;</button>
    <span>${monthNames[month]} ${year}</span>
    <button id="nextMonth">&#8594;</button>
  `;
  calendarEl.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
    const dayLabel = document.createElement('div');
    dayLabel.className = 'calendar-day-label';
    dayLabel.textContent = d;
    grid.appendChild(dayLabel);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-cell calendar-cell-empty';
    grid.appendChild(empty);
  }

const isCurrentMonth = (month === today.getMonth() && year === today.getFullYear());
  const todayDate = today.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    if (isCurrentMonth && day === todayDate) {
      cell.classList.add('is-today');
    }
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const dayNum = document.createElement('div');
    dayNum.className = 'calendar-day-num';
    if (isCurrentMonth && day === todayDate) {
      dayNum.innerHTML = day + ' <span class="today-label">Today</span>';
    } else {
      dayNum.textContent = day;
    }
    cell.appendChild(dayNum);

    const dayEvents = eventsByDate[dateStr];
    if (dayEvents) {
      cell.classList.add('has-event');
      const chips = document.createElement('div');
      chips.className = 'calendar-chips';
      dayEvents.forEach((e, i) => {
        const style = getEventStyle(e.title);
        const chip = document.createElement('div');
        chip.className = 'calendar-chip';
        chip.style.backgroundColor = style.color;
        chip.textContent = style.label;
        chips.appendChild(chip);
      });
      cell.appendChild(chips);

      cell.addEventListener('mouseenter', () => showTooltip(cell, dayEvents));
      cell.addEventListener('mouseleave', hideTooltip);
    }
   grid.appendChild(cell);
  }

  const totalCells = firstDay + daysInMonth;
  const trailingEmpty = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < trailingEmpty; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-cell calendar-cell-empty';
    grid.appendChild(empty);
  }

  calendarEl.appendChild(grid);

  document.getElementById('prevMonth').addEventListener('click', () => {
    hideTooltip();
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    hideTooltip();
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
  });
}

renderCalendar(currentMonth, currentYear);