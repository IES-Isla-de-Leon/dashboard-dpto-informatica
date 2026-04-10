<template>
  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
    <article class="rounded-xl border border-sky-200 bg-sky-50 p-4 text-left">
      <p class="text-sm font-medium uppercase tracking-wide text-sky-700">Lectivo</p>
      <p class="text-3xl font-bold text-sky-900 md:text-4xl">{{ schoolDays }} días</p>
    </article>
    <article class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left">
      <p class="text-sm font-medium uppercase tracking-wide text-emerald-700">Laborable</p>
      <p class="text-3xl font-bold text-emerald-900 md:text-4xl">{{ workDays }} días</p>
    </article>
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
