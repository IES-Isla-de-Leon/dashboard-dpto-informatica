import { describe, expect, it } from "vitest";
import { formatDate, formatTime, iso, toLocalDate } from "../src/services/dateService";

describe("dateService", () => {
  it("parses ISO date string to local end of day", () => {
    const date = toLocalDate("2026-04-10");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(10);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
    expect(date.getSeconds()).toBe(59);
  });

  it("formats Date to ISO string", () => {
    expect(iso(new Date(2026, 3, 10))).toBe("2026-04-10");
  });

  it("formats locale date and time in spanish", () => {
    const date = new Date(2026, 3, 10, 8, 5, 9);

    expect(formatDate(date)).toContain("2026");
    expect(formatTime(date)).toBe("08:05:09");
  });
});
