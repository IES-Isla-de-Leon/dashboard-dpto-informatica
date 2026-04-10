import { afterEach, describe, expect, it, vi } from "vitest";
import { buildFinalEvents, fetchDashboardData } from "../src/services/sheetService";

describe("sheetService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses key-value rows and event rows from sheet", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { key: "message", value: "Hola" },
          { key: "end_school_date", value: "2026-06-30" },
          { key: "evento Excursión", value: "2026-04-21" },
          { key: "periodo Evaluaciones", value: "2026-04-10 2026-04-15" },
        ],
      })
    );

    const data = await fetchDashboardData();

    expect(data.values.message).toBe("Hola");
    expect(data.values.end_school_date).toBe("2026-06-30");
    expect(data.events).toEqual([
      { title: " Excursión", date: "2026-04-21" },
    ]);
    expect(data.periods).toEqual([
      {
        title: "Evaluaciones",
        startDate: "2026-04-10",
        endDate: "2026-04-15",
      },
    ]);
  });

  it("adds last school/work events and sorts by date", () => {
    const values = {
      end_school_date: "2026-06-30",
      end_work_date: "2026-12-31",
    };

    const finalEvents = buildFinalEvents(values, [
      { title: "A", date: "2026-08-01" },
      { title: "B", date: "2026-04-01" },
    ]);

    expect(finalEvents[0].title).toBe("B");
    expect(finalEvents.at(-1).title).toBe("Último día laborable");
    expect(finalEvents.some((e) => e.title === "Último día lectivo")).toBe(true);
  });
});
