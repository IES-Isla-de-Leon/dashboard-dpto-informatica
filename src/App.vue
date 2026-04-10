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

        <section class="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
          <h3 class="mb-3 text-lg font-semibold text-indigo-900">Periodos</h3>

          <div v-if="periods.length === 0" class="text-sm text-indigo-700/70">
            No hay periodos configurados
          </div>

          <ul v-else class="space-y-2">
            <li
              v-for="period in periods"
              :key="`${period.title}-${period.startDate}-${period.endDate}`"
              class="rounded-lg border border-indigo-200 bg-white/80 px-3 py-2"
            >
              <p class="text-sm font-semibold text-indigo-900">{{ period.title }}</p>
              <p class="text-xs font-medium text-indigo-700">
                {{ period.startDate }} - {{ period.endDate }}
              </p>
            </li>
          </ul>
        </section>
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
const {
  events,
  periods,
  messageText,
  endSchoolDate,
  endWorkDate,
  currentTrimester,
} =
  useDashboardData();

const { schoolDays, workDays, calendarMonths } = useDayMetrics({
  events,
  periods,
  endSchoolDate,
  endWorkDate,
  currentTrimester,
});
</script>
