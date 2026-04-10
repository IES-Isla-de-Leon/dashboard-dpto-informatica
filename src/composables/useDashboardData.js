import { computed, onMounted, onUnmounted, ref } from "vue";
import { dashboardConfig } from "../config/dashboard.config";
import { buildFinalEvents, fetchDashboardData } from "../services/sheetService";

export function useDashboardData() {
  const values = ref({ default: dashboardConfig.defaultMessage });
  const events = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  let refreshIntervalId = null;

  async function refresh() {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchDashboardData();
      values.value = data.values;
      events.value = buildFinalEvents(data.values, data.events, dashboardConfig);
    } catch (e) {
      error.value = e;
      console.error("Error hoja:", e);
    } finally {
      isLoading.value = false;
    }
  }

  const messageText = computed(
    () => values.value.message || values.value.default || ""
  );

  const endSchoolDate = computed(
    () => values.value.end_school_date || dashboardConfig.defaultEndSchoolDate
  );

  const endWorkDate = computed(
    () => values.value.end_work_date || dashboardConfig.defaultEndWorkDate
  );

  onMounted(async () => {
    await refresh();
    refreshIntervalId = setInterval(refresh, dashboardConfig.refreshIntervalMs);
  });

  onUnmounted(() => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }
  });

  return {
    values,
    events,
    isLoading,
    error,
    messageText,
    endSchoolDate,
    endWorkDate,
    refresh,
  };
}
