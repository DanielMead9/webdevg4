/* -------- Dynamic Page Heading -------- */
const params = new URLSearchParams(window.location.search);
const serviceName = params.get("service");
const heading = document.getElementById("pageHeading");
if (serviceName) {
  heading.textContent =
    "Schedule an Appointment for " + decodeURIComponent(serviceName);
}

/* -------- Calendar Setup -------- */
const calendar = document.getElementById("calendar");
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const monthStart = new Date(currentYear, currentMonth, 1);
const monthEnd = new Date(currentYear, currentMonth + 1, 0);
const daysInMonth = monthEnd.getDate();

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Weekday header row
let headerRow = '<div class="w3-row w3-bottombar w3-border-gray">';
weekdays.forEach(
  (day) =>
    (headerRow += `<div class="w3-col calendar-day"><strong>${day}</strong></div>`)
);
headerRow += "</div>";
calendar.innerHTML = headerRow;

// Day cells
let dayCells = "";
let startDay = monthStart.getDay();
for (let i = 0; i < startDay; i++) {
  dayCells += '<div class="w3-col calendar-day empty">&nbsp;</div>';
}

for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(currentYear, currentMonth, day);
  const isToday = day === today.getDate();
  dayCells += `
        <div 
          class="w3-col calendar-day ${isToday ? "today selected" : ""}" 
          data-date="${date.toDateString()}"
          data-day="${date.getDay()}"
          onclick="selectDay(this)"
        >
          ${day}
        </div>`;
}

calendar.innerHTML += dayCells;

/* -------- Day Selection and Time Slots -------- */
const slotsContainer = document.getElementById("slotsContainer");
const selectedDateHeading = document.getElementById("selectedDateHeading");

function showSlots(dateString, dayOfWeek) {
  selectedDateHeading.textContent = "Available Times for " + dateString;
  slotsContainer.innerHTML = "";

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    slotsContainer.innerHTML =
      "<p class='w3-text-red w3-large'>No time slots available on weekends.</p>";
  } else {
    for (let hour = 9; hour <= 16; hour++) {
      const ampm = hour < 12 ? "AM" : "PM";
      const displayHour = hour <= 12 ? hour : hour - 12;
      const button = document.createElement("button");
      button.textContent = `${displayHour}:00 ${ampm}`;
      button.className = "w3-button w3-blue w3-round time-slot";
      button.onclick = () =>
        alert(`You selected ${displayHour}:00 ${ampm} on ${dateString}`);
      slotsContainer.appendChild(button);
    }
  }
}

function selectDay(element) {
  // Remove previous selection
  document
    .querySelectorAll(".calendar-day.selected")
    .forEach((el) => el.classList.remove("selected"));

  // Highlight clicked day
  element.classList.add("selected");

  // Show time slots for selected day
  const dateString = element.getAttribute("data-date");
  const dayOfWeek = parseInt(element.getAttribute("data-day"));
  showSlots(dateString, dayOfWeek);
}

// Default: show today’s date and slots
window.onload = () => {
  const todayElement = document.querySelector(".calendar-day.today");
  if (todayElement) {
    const dateString = todayElement.getAttribute("data-date");
    const dayOfWeek = parseInt(todayElement.getAttribute("data-day"));
    showSlots(dateString, dayOfWeek);
  }
};
