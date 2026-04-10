<template>
  <div>
    <div id="date">{{ dateText }}</div>
    <div id="time">{{ timeText }}</div>
    <div id="message">{{ messageText }}</div>
  </div>
</template>

<script setup>
defineProps({
  dateText: {
    type: String,
    required: true,
  },
  timeText: {
    type: String,
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
});
</script>
