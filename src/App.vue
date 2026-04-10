<template>
  <div id="wrapper-left">
    <ClockPanel
      :date-text="dateText"
      :time-text="timeText"
      :message-text="messageText"
    />

    <CountersPanel :school-days="schoolDays" :work-days="workDays" />

    <CalendarPanel :weekdays="WEEKDAYS" :days="calendarDays" />
  </div>

  <div id="wrapper-right">
    <EventList :events="events" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import CalendarPanel from "./components/CalendarPanel.vue";
import ClockPanel from "./components/ClockPanel.vue";
import CountersPanel from "./components/CountersPanel.vue";
import EventList from "./components/EventList.vue";
import { useDashboardData } from "./composables/useDashboardData";
import { useDailyRefresh } from "./composables/useDailyRefresh";
import { useClock } from "./composables/useClock";
import { WEEKDAYS, buildCalendarDays } from "./domain/calendarModel";
import { remainingDays } from "./domain/countersModel";
import { dashboardConfig } from "./config/dashboard.config";
import { toLocalDate } from "./services/dateService";

const { dateText, timeText } = useClock();
const { events, messageText, endSchoolDate, endWorkDate } = useDashboardData();

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
  return remainingDays(toLocalDate(endWorkDate.value), dashboardConfig.holidaysWork);
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
</script>
