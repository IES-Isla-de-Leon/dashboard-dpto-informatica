import { computed, ref } from "vue";
import { buildCalendarDays } from "../domain/calendarModel";
import { remainingDays } from "../domain/countersModel";
import { dashboardConfig } from "../config/dashboard.config";
import { useDailyRefresh } from "./useDailyRefresh";
import { toLocalDate } from "../services/dateService";

export function useDayMetrics({ events, endSchoolDate, endWorkDate }) {
  const dayMarker = ref(Date.now());

  useDailyRefresh(() => {
    dayMarker.value = Date.now();
  });

  const schoolDays = computed(() => {
    void dayMarker.value;
    return remainingDays(
      toLocalDate(endSchoolDate.value),
      dashboardConfig.holidaysSchool
    );
  });

  const workDays = computed(() => {
    void dayMarker.value;
    return remainingDays(
      toLocalDate(endWorkDate.value),
      dashboardConfig.holidaysWork
    );
  });

  const calendarDays = computed(() => {
    void dayMarker.value;
    return buildCalendarDays({
      now: new Date(),
      endSchoolDate: endSchoolDate.value,
      endWorkDate: endWorkDate.value,
      events: events.value,
    });
  });

  return {
    schoolDays,
    workDays,
    calendarDays,
  };
}
