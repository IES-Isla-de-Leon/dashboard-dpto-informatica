/*********************************************************************
 * CONFIGURACIÓN GENERAL
 ********************************************************************/
const DEFAULT_END_SCHOOL_DATE = "2025-06-30";
const DEFAULT_END_WORK_DATE = "2025-12-31";
const HOLIDAYS_SCHOOL = ["2025-06-09"];
const HOLIDAYS_WORK = ["2025-08-15", "2025-10-12", "2025-12-25"];
const GOOGLE_SHEET_ID = "1QLYmSVPq8-uHr1mY9qCUjbWKDicGDGKWVIcjQjm9Mpk";
const GOOGLE_SHEET_TAB = "mensajes";
const MESSAGE_SHEET_URL = `https://opensheet.elk.sh/${GOOGLE_SHEET_ID}/${GOOGLE_SHEET_TAB}`;

/*********************************************************************
 * FUNCIONES AUXILIARES
 ********************************************************************/
const localeES = "es-ES";
const toLocalDate = (str) =>
  /^\\d{4}-\\d{2}-\\d{2}$/.test(str)
    ? (() => {
        const [y, m, d] = str.split("-").map(Number);
        return new Date(y, m - 1, d, 23, 59, 59);
      })()
    : new Date(str);
const iso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const formatDate = (d) =>
  d.toLocaleDateString(localeES, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const formatTime = (d) =>
  d.toLocaleTimeString(localeES, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
const isWeekend = (d) => [0, 6].includes(d.getDay());
const remainingDays = (until, holidays) => {
  let today = new Date(),
    count = 0;
  for (let d = new Date(today); d <= until; d.setDate(d.getDate() + 1)) {
    if (!isWeekend(d) && !holidays.includes(iso(d))) count++;
  }
  return count;
};

/*********************************************************************
 * CARGA DE DATOS DESDE GOOGLE SHEETS
 ********************************************************************/
let loadedValues = { default: "¡Que tengas un gran día!" };
let loadedEvents = [];

async function fetchSheetValues() {
  if (!GOOGLE_SHEET_ID || GOOGLE_SHEET_ID.includes("<TU_SHEET_ID>")) {
    console.warn("GOOGLE_SHEET_ID no configurado.");
    return;
  }
  loadedEvents = [];

  try {
    const res = await fetch(MESSAGE_SHEET_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const rows = await res.json();
    const map = {};
    rows.forEach(({ key = "", value = "" }) => {
      const k = key.trim();
      if (k) map[k] = value;
      if (k.startsWith("evento")) {
        loadedEvents.push([k.slice(6), value]);
      }
    });

    loadedValues = map;

    loadedEvents.push([
      "Último día lectivo",
      loadedValues["end_school_date"] || DEFAULT_END_SCHOOL_DATE,
    ]);

    loadedEvents.push([
      "Último día laborable",
      loadedValues["end_work_date"] || DEFAULT_END_WORK_DATE,
    ]);

    loadedEvents.sort((a, b) => new Date(a[1]) - new Date(b[1]));

    updateEvents();
    updateCounters();
    renderCalendar();
  } catch (e) {
    console.error("Error hoja:", e);
  }
}

/*********************************************************************
 * CALENDARIO
 ********************************************************************/
function renderCalendar() {
  const cal = document.getElementById("calendar");
  if (!cal) return;
  const now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth();
  const firstDay = new Date(year, month, 1),
    offset = (firstDay.getDay() + 6) % 7,
    daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const todayIso = iso(now),
    endSchoolIso = iso(
      toLocalDate(loadedValues["end_school_date"] || DEFAULT_END_SCHOOL_DATE)
    ),
    endWorkIso = iso(
      toLocalDate(loadedValues["end_work_date"] || DEFAULT_END_WORK_DATE)
    );
  let html = "";
  weekdays.forEach((w) => (html += `<div class="day header">${w}</div>`));

  const loadedEventsDates = loadedEvents.map((elem) => elem[1]);

  for (let i = 0; i < offset; i++) html += "<div></div>";
  for (let d = 1; d <= daysInMonth; d++) {
    const dateNative = new Date(year, month, d);
    const dateIso = iso(dateNative);
    let cls = "day";
    if (dateIso === todayIso) cls += " today";

    if (dateIso === endSchoolIso) 
        cls += " lastLective";
    else if (dateIso === endWorkIso) 
        cls += " lastWork";
    else if (loadedEventsDates.indexOf(dateIso) != -1) 
        cls += " eventDay";
    else if (isWeekend(dateNative)) 
        cls += " weekend";

    html += `<div class="${cls}">${d}</div>`;
  }
  cal.innerHTML = html;
}

/*********************************************************************
 * ACTUALIZACIÓN DE PANTALLA
 ********************************************************************/
function updateCounters() {
  const endSchoolDate = toLocalDate(
    loadedValues["end_school_date"] || DEFAULT_END_SCHOOL_DATE
  );
  const endWorkDate = toLocalDate(
    loadedValues["end_work_date"] || DEFAULT_END_WORK_DATE
  );
  document.getElementById("schoolDays").textContent = `Quedan ${remainingDays(
    endSchoolDate,
    HOLIDAYS_SCHOOL
  )} días lectivos`;
  document.getElementById("workDays").textContent = `Quedan ${remainingDays(
    endWorkDate,
    HOLIDAYS_WORK
  )} días laborables`;
}

function updateClock() {
  const now = new Date();
  document.getElementById("date").textContent = formatDate(now);
  document.getElementById("time").textContent = formatTime(now);
  document.getElementById("message").textContent =
    loadedValues["message"] || loadedValues.default || "";
}

function updateEvents() {
  let eventListElement = document.getElementById("event-list");

  let innerHTML = "";

  for (let index = 0; index < loadedEvents.length; index++) {
    const evt = loadedEvents[index];
    let eventElement = '<div class="event">';
    eventElement += `<div class="event-date">${evt[1]}</div>`;
    eventElement += `<div class="event-title">${evt[0]}</div>`;
    eventElement += "</div>";

    innerHTML += eventElement;
  }

  eventListElement.innerHTML = innerHTML;
}

/*********************************************************************
 * INICIALIZACIÓN
 ********************************************************************/
async function init() {
  await fetchSheetValues();
  updateCounters();
  updateClock();
  updateEvents();
  renderCalendar();

  // Obtener nuevos valores de la hoja de cálculo cada 15 minutos
  setInterval(fetchSheetValues, 15 * 60 * 1000);

  // Actualizar reloj cada segundo
  setInterval(updateClock, 1000);

  const millisTillMidnight = new Date().setHours(24, 1, 0, 0) - Date.now();

  // Actualiza calendario y contadores de días a las 0:00
  setTimeout(() => {
    updateCounters();
    renderCalendar();
    setInterval(() => {
      updateCounters();
      renderCalendar();
    }, 24 * 60 * 60 * 1000);
  }, millisTillMidnight);
}
document.addEventListener("DOMContentLoaded", init);
