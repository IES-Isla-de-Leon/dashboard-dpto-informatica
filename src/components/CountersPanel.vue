<template>
  <div>
    <div id="schoolDays" class="counter">Quedan {{ schoolDays }} días lectivos</div>
    <div id="workDays" class="counter">Quedan {{ workDays }} días laborables</div>
  </div>
</template>

<script setup>
defineProps({
  schoolDays: {
    type: Number,
    required: true,
  },
  workDays: {
    type: Number,
    required: true,
  },
});
</script>
