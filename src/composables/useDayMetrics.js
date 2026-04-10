import { computed, ref } from "vue";
import { MONTHS_ES, buildCalendarDaysForMonth } from "../domain/calendarModel";
import { remainingDays } from "../domain/countersModel";
import { dashboardConfig } from "../config/dashboard.config";
import { useDailyRefresh } from "./useDailyRefresh";
import { toLocalDate } from "../services/dateService";

const trimesterMonths = {
  1: [8, 9, 10, 11],
  2: [0, 1, 2],
  3: [3, 4, 5],
};

export function useDayMetrics({ events, endSchoolDate, endWorkDate, currentTrimester }) {
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

  const calendarMonths = computed(() => {
    void dayMarker.value;
    const now = new Date();
    const year = now.getFullYear();
    const monthIndexes = trimesterMonths[currentTrimester.value] || trimesterMonths[3];

    return monthIndexes.map((monthIndex) => ({
      monthIndex,
      year,
      monthName: MONTHS_ES[monthIndex],
      days: buildCalendarDaysForMonth({
        year,
        monthIndex,
        todayDate: now,
        endSchoolDate: endSchoolDate.value,
        endWorkDate: endWorkDate.value,
        events: events.value,
      }),
    }));
  });

  return {
    schoolDays,
    workDays,
    calendarMonths,
  };
}
