import { iso, isWeekend, toLocalDate } from "../services/dateService";

export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function buildCalendarDays({ now, endSchoolDate, endWorkDate, events, periods = [] }) {
  return buildCalendarDaysForMonth({
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
    todayDate: now,
    endSchoolDate,
    endWorkDate,
    events,
    periods,
  });
}

export function buildCalendarDaysForMonth({
  year,
  monthIndex,
  todayDate,
  endSchoolDate,
  endWorkDate,
  events,
  periods = [],
}) {
  const firstDay = new Date(year, monthIndex, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const todayIso = iso(todayDate);
  const endSchoolIso = iso(toLocalDate(endSchoolDate));
  const endWorkIso = iso(toLocalDate(endWorkDate));
  const eventDates = new Set(events.map((event) => event.date));

  const periodRanges = periods
    .map((period) => ({
      startIso: period.startDate,
      endIso: period.endDate,
    }))
    .filter(
      (period) =>
        /^\d{4}-\d{2}-\d{2}$/.test(period.startIso) &&
        /^\d{4}-\d{2}-\d{2}$/.test(period.endIso) &&
        period.startIso <= period.endIso
    );

  const days = [];

  for (let i = 0; i < offset; i += 1) {
    days.push({ empty: true, day: null, cssClass: "" });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    const dateNative = new Date(year, monthIndex, d);
    const dateIso = iso(dateNative);
    let cssClass = "day";

    if (dateIso < todayIso) {
      cssClass += " pastDay";
    }

    if (dateIso === todayIso) {
      cssClass += " today";
    }

    if (dateIso === endSchoolIso) {
      cssClass += " lastLective";
    } else if (dateIso === endWorkIso) {
      cssClass += " lastWork";
    } else if (eventDates.has(dateIso)) {
      cssClass += " eventDay";
    } else if (
      periodRanges.some((period) => dateIso >= period.startIso && dateIso <= period.endIso)
    ) {
      cssClass += " periodDay";
    } else if (isWeekend(dateNative)) {
      cssClass += " weekend";
    }

    days.push({ empty: false, day: d, dateIso, cssClass });
  }

  return days;
}
