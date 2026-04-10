import { computed, onMounted, onUnmounted, ref } from "vue";
import { formatDate, formatTime } from "../services/dateService";

export function useClock() {
  const now = ref(new Date());
  let timerId = null;

  const dateText = computed(() => formatDate(now.value));
  const timeText = computed(() => formatTime(now.value));

  onMounted(() => {
    timerId = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    if (timerId) {
      clearInterval(timerId);
    }
  });

  return {
    now,
    dateText,
    timeText,
  };
}
