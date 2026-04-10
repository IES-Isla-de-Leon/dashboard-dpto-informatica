import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCalendarDays } from "../src/domain/calendarModel";
import { remainingDays } from "../src/domain/countersModel";
import { toLocalDate } from "../src/services/dateService";

function findDay(days, dayNumber) {
  return days.find((day) => !day.empty && day.day === dayNumber);
}

describe("domain models", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("computes remaining work/school days excluding weekends and holidays", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T10:00:00"));

    const until = toLocalDate("2026-04-10");
    const count = remainingDays(until, ["2026-04-08"]);

    expect(count).toBe(4);
  });

  it("classifies calendar day types like current dashboard", () => {
    const days = buildCalendarDays({
      now: new Date(2026, 3, 10),
      endSchoolDate: "2026-04-30",
      endWorkDate: "2026-04-29",
      events: [{ title: "Evento", date: "2026-04-15" }],
      periods: [{ title: "Periodo", startDate: "2026-04-16", endDate: "2026-04-18" }],
    });

    expect(findDay(days, 10).cssClass).toContain("today");
    expect(findDay(days, 15).cssClass).toContain("eventDay");
    expect(findDay(days, 29).cssClass).toContain("lastWork");
    expect(findDay(days, 30).cssClass).toContain("lastLective");
    expect(findDay(days, 11).cssClass).toContain("weekend");
    expect(findDay(days, 16).cssClass).toContain("periodDay");
  });
});
