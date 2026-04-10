<template>
  <section class="panel">
    <h2 class="mb-4 text-2xl font-semibold text-slate-700">Lista de eventos</h2>
    <div class="space-y-2">
      <div
        v-for="event in events"
        :key="`${event.title}-${event.date}`"
        class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
      >
        <div class="rounded-md bg-white px-2 py-1 text-sm font-medium text-slate-600">
          {{ event.date }}
        </div>
        <div
          class="text-right text-base font-semibold text-slate-700"
          :class="{ 'line-through opacity-50': isPastEvent(event.date) }"
        >
          {{ event.title }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { iso, toLocalDate } from "../services/dateService";

defineProps({
  events: {
    type: Array,
    required: true,
  },
});

function isPastEvent(dateIso) {
  const todayIso = iso(new Date());
  const eventIso = iso(toLocalDate(dateIso));
  return eventIso < todayIso;
}
</script>
