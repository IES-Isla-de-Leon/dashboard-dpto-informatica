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
import CalendarPanel from "./components/CalendarPanel.vue";
import ClockPanel from "./components/ClockPanel.vue";
import CountersPanel from "./components/CountersPanel.vue";
import EventList from "./components/EventList.vue";
import { useDashboardData } from "./composables/useDashboardData";
import { useDayMetrics } from "./composables/useDayMetrics";
import { useClock } from "./composables/useClock";
import { WEEKDAYS } from "./domain/calendarModel";

const { dateText, timeText } = useClock();
const { events, messageText, endSchoolDate, endWorkDate } = useDashboardData();

const { schoolDays, workDays, calendarDays } = useDayMetrics({
  events,
  endSchoolDate,
  endWorkDate,
});
</script>
