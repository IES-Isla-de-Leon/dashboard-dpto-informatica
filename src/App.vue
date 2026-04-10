<template>
  <main class="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 p-6">
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="panel flex flex-col gap-6">
        <ClockPanel
          :date-text="dateText"
          :time-text="timeText"
          :message-text="messageText"
        />
        <CountersPanel :school-days="schoolDays" :work-days="workDays" />
      </div>

      <EventList :events="events" />
    </section>

    <section class="panel flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-700">Calendarios del trimestre</h2>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Trimestre {{ currentTrimester }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <CalendarPanel
          v-for="month in calendarMonths"
          :key="`${month.year}-${month.monthIndex}`"
          :title="month.monthName"
          :year="month.year"
          :weekdays="WEEKDAYS"
          :days="month.days"
        />
      </div>
    </section>
  </main>
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
const { events, messageText, endSchoolDate, endWorkDate, currentTrimester } =
  useDashboardData();

const { schoolDays, workDays, calendarMonths } = useDayMetrics({
  events,
  endSchoolDate,
  endWorkDate,
  currentTrimester,
});
</script>
