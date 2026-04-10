<template>
  <div>
    <h2>Lista de eventos</h2>
    <div id="event-list">
      <div
        v-for="event in events"
        :key="`${event.title}-${event.date}`"
        class="event"
      >
        <div class="event-date">{{ event.date }}</div>
        <div class="event-title" :class="{ striked: isPastEvent(event.date) }">
          {{ event.title }}
        </div>
      </div>
    </div>
  </div>
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
