// --- Page Setup ---
const pageTitle = document.getElementById("page-title");
const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const timeSlots = document.getElementById("timeSlots");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

// --- Determine Page Title from Link ---
const params = new URLSearchParams(window.location.search);
const service = params.get("service");
if (service) {
  pageTitle.textContent = `Schedule an Appointment for ${service}`;
}

// --- Date Handling ---
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const todayMidnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

// Limit navigation to 2 months ahead
const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);

// --- Build Calendar ---
function buildCalendar(month, year) {
  calendar.innerHTML = "";

  // Start week on Monday, end on Sunday
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Add weekday headers
  weekdays.forEach((day) => {
    const header = document.createElement("div");
    header.textContent = day;
    header.classList.add("calendar-header");
    calendar.appendChild(header);
  });

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay(); // Sunday=0, Monday=1, etc.
  startDay = (startDay + 6) % 7; // Make Monday=0, Sunday=6

  const numDays = new Date(year, month + 1, 0).getDate();

  // Fill in empty slots before first day
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("calendar-day", "empty");
    calendar.appendChild(empty);
  }

  // Add the days
  for (let date = 1; date <= numDays; date++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = date;
    dayDiv.classList.add("calendar-day");

    const currentDate = new Date(year, month, date);

    if (currentDate.toDateString() === todayMidnight.toDateString()) {
      dayDiv.classList.add("today");
    }

    if (currentDate < todayMidnight) {
      dayDiv.classList.add("past");
    } else {
      dayDiv.addEventListener("click", () => selectDate(currentDate, dayDiv));
    }

    calendar.appendChild(dayDiv);
  }

  // Update header
  monthYear.textContent = `${new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(year, month))} ${year}`;
}

// --- Date Selection ---
function selectDate(date, element) {
  // Clear previous selection
  document
    .querySelectorAll(".calendar-day")
    .forEach((d) => d.classList.remove("selected"));
  element.classList.add("selected");

  const dayOfWeek = date.getDay(); // Sunday=0 ... Saturday=6
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    timeSlots.innerHTML = `<p class="w3-text-red">No time slots available on weekends.</p>`;
  } else {
    const times = [];
    for (let hour = 9; hour <= 16; hour++) {
      const ampm = hour < 12 ? "AM" : "PM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      times.push(`${displayHour}:00 ${ampm}`);
    }
    timeSlots.innerHTML = times
      .map(
        (time) =>
          `<button class="w3-button w3-border w3-round-large time-slot">${time}</button>`
      )
      .join("");
  }
}

// --- Month Navigation ---
prevMonthBtn.addEventListener("click", () => {
  if (currentMonth > today.getMonth() || currentYear > today.getFullYear()) {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    buildCalendar(currentMonth, currentYear);
  }
});

nextMonthBtn.addEventListener("click", () => {
  const next = new Date(currentYear, currentMonth + 1, 1);
  if (next <= maxMonth) {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    buildCalendar(currentMonth, currentYear);
  }
});

// --- Initialize ---
buildCalendar(currentMonth, currentYear);

// Default select today's date
setTimeout(() => {
  const allDays = document.querySelectorAll(".calendar-day");
  allDays.forEach((d) => {
    if (d.classList.contains("today")) {
      d.click();
    }
  });
}, 200);
