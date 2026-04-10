import { iso, isWeekend, toLocalDate } from "../services/dateService";

export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function buildCalendarDays({ now, endSchoolDate, endWorkDate, events }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayIso = iso(now);
  const endSchoolIso = iso(toLocalDate(endSchoolDate));
  const endWorkIso = iso(toLocalDate(endWorkDate));
  const eventDates = new Set(events.map((event) => event.date));

  const days = [];

  for (let i = 0; i < offset; i += 1) {
    days.push({ empty: true, day: null, cssClass: "" });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    const dateNative = new Date(year, month, d);
    const dateIso = iso(dateNative);
    let cssClass = "day";

    if (dateIso === todayIso) {
      cssClass += " today";
    }

    if (dateIso === endSchoolIso) {
      cssClass += " lastLective";
    } else if (dateIso === endWorkIso) {
      cssClass += " lastWork";
    } else if (eventDates.has(dateIso)) {
      cssClass += " eventDay";
    } else if (isWeekend(dateNative)) {
      cssClass += " weekend";
    }

    days.push({ empty: false, day: d, dateIso, cssClass });
  }

  return days;
}
