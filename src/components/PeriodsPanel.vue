<template>
    <section class="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
        <h3 class="mb-3 text-lg font-semibold text-indigo-900">Periodos</h3>

        <div v-if="periods.length === 0" class="text-sm text-indigo-700/70">
            No hay periodos configurados
        </div>

        <ul v-else class="space-y-2">
            <li
                v-for="period in periods"
                :key="`${period.title}-${period.startDate}-${period.endDate}`"
                class="rounded-lg border border-indigo-200 bg-white/80 px-3 py-2">
                <p class="text-sm font-semibold text-indigo-900">{{ period.title }}</p>
                <p class="text-xs font-medium text-indigo-700">
                    {{ period.startDate }} - {{ period.endDate }}
                </p>
            </li>
        </ul>
    </section>
</template>

<script setup>
defineProps({
  periods: {
    type: Array,
    required: true,
  },
});
</script>