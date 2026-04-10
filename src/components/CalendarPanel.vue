<template>
  <div id="calendar">
    <div v-for="weekday in weekdays" :key="weekday" class="day header">
      {{ weekday }}
    </div>

    <template v-for="(day, index) in days" :key="index">
      <div v-if="day.empty"></div>
      <div v-else :class="day.cssClass">{{ day.day }}</div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  weekdays: {
    type: Array,
    required: true,
  },
  days: {
    type: Array,
    required: true,
  },
});
</script>
