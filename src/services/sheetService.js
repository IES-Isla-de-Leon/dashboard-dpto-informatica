import { dashboardConfig } from "../config/dashboard.config";

function buildMessageSheetUrl(sheetId, tab) {
  return `https://opensheet.elk.sh/${sheetId}/${tab}`;
}

export async function fetchDashboardData() {
  const { googleSheetId, googleSheetTab, defaultMessage } = dashboardConfig;

  if (!googleSheetId || googleSheetId.includes("<TU_SHEET_ID>")) {
    console.warn("GOOGLE_SHEET_ID no configurado.");
    return {
      values: { default: defaultMessage },
      events: [],
    };
  }

  const url = buildMessageSheetUrl(googleSheetId, googleSheetTab);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(res.statusText || "Error al cargar datos");
  }

  const rows = await res.json();
  const values = {};
  const events = [];

  for (const { key = "", value = "" } of rows) {
    const normalizedKey = String(key).trim();
    if (!normalizedKey) {
      continue;
    }

    values[normalizedKey] = value;

    if (normalizedKey.startsWith("evento")) {
      events.push({
        title: normalizedKey.slice(6),
        date: String(value),
      });
    }
  }

  if (!values.default) {
    values.default = defaultMessage;
  }

  return { values, events };
}

export function buildFinalEvents(values, events, config = dashboardConfig) {
  const finalEvents = [...events];

  finalEvents.push({
    title: "Último día lectivo",
    date: values.end_school_date || config.defaultEndSchoolDate,
  });

  finalEvents.push({
    title: "Último día laborable",
    date: values.end_work_date || config.defaultEndWorkDate,
  });

  finalEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  return finalEvents;
}
