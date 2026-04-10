import { onMounted, onUnmounted } from "vue";

export function useDailyRefresh(callback) {
  let timeoutId = null;
  let intervalId = null;

  onMounted(() => {
    const millisTillMidnight = new Date().setHours(24, 1, 0, 0) - Date.now();

    timeoutId = setTimeout(() => {
      callback();

      intervalId = setInterval(() => {
        callback();
      }, 24 * 60 * 60 * 1000);
    }, millisTillMidnight);
  });

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (intervalId) {
      clearInterval(intervalId);
    }
  });
}
