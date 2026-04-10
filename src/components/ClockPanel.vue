<template>
  <div class="space-y-3 text-center">
    <p class="text-xl font-medium capitalize text-slate-600 md:text-2xl">{{ dateText }}</p>
    <p class="rounded-xl bg-sky-100 px-4 py-3 text-5xl font-bold tracking-wide text-sky-800 md:text-7xl">
      {{ timeText }}
    </p>
    <p class="rounded-xl bg-emerald-50 px-4 py-3 text-lg italic text-emerald-800 md:text-xl">
      {{ messageText }}
    </p>
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
