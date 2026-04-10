import { iso, isWeekend } from "../services/dateService";

export function remainingDays(until, holidays) {
  let count = 0;
  const today = new Date();

  for (const d = new Date(today); d <= until; d.setDate(d.getDate() + 1)) {
    if (!isWeekend(d) && !holidays.includes(iso(d))) {
      count += 1;
    }
  }

  return count;
}
