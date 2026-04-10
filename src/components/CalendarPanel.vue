<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 class="mb-3 text-lg font-semibold text-slate-700">{{ title }} {{ year }}</h3>

    <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
      <div v-for="weekday in weekdays" :key="weekday" class="py-1">
        {{ weekday }}
      </div>
    </div>

    <div class="mt-1 grid grid-cols-7 gap-1">
      <template v-for="(day, index) in days" :key="index">
        <div v-if="day.empty" class="h-9 rounded-md bg-slate-50/50"></div>
        <div
          v-else
          class="flex h-9 items-center justify-center rounded-md border text-sm font-semibold"
          :class="dayClass(day.cssClass)"
        >
          {{ day.day }}
        </div>
      </template>
    </div>
  </article>
</template>

<script setup>
import { PERIOD_COLORS } from '../config/periodColors.js';

defineProps({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  weekdays: {
    type: Array,
    required: true,
  },
  days: {
    type: Array,
    required: true,
  },
});

function dayClass(cssClass) {
  const pastModifier = cssClass.includes("pastDay") && !cssClass.includes("today")
    ? " opacity-55"
    : "";

  if (cssClass.includes("lastLective")) {
    return `border-emerald-300 bg-emerald-200 text-emerald-900${pastModifier}`;
  }
  if (cssClass.includes("weekend")) {
    return `border-slate-200 bg-slate-100 text-slate-500${pastModifier}`;
  }
  if (cssClass.includes("lastWork")) {
    return `border-cyan-300 bg-cyan-200 text-cyan-900${pastModifier}`;
  }
  if (cssClass.includes("today")) {
    return "border-sky-400 bg-sky-500 text-white";
  }
  if (cssClass.includes("eventDay")) {
    return `border-teal-300 bg-teal-200 text-teal-900${pastModifier}`;
  }
  if (cssClass.includes("periodDay")) {
    const match = cssClass.match(/\bperiod-(\d+)\b/);
    const idx = match ? parseInt(match[1]) % PERIOD_COLORS.length : 0;
    const c = PERIOD_COLORS[idx];
    return `${c.border} ${c.bg} ${c.text}${pastModifier}`;
  }

  return `border-slate-100 bg-white text-slate-700${pastModifier}`;
}
</script>
