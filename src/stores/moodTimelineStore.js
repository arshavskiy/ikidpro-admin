import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Global Pinia store for moodTimelineDaily
export const useMoodTimelineStore = defineStore("moodTimeline", () => {
  // moodTimelineDaily: { [date: string]: Array<{ [mood: string]: number }> }
  const moodTimelineDaily = ref({});

  function setMoodTimelineDaily(newTimeline) {
    moodTimelineDaily.value = newTimeline || {};
  }

  function clearMoodTimelineDaily() {
    moodTimelineDaily.value = {};
  }

  // Getter: for each day, returns a map of hour (0-23) to max mood label (by sum of 15-min intervals in that hour)
  const moodTimelineLabels = computed(() => {
    const result = {};
    for (const [date, intervals] of Object.entries(moodTimelineDaily.value)) {
      // intervals: { [intervalIndex: string]: { [mood: string]: number } }
      // We want: { [hour: string]: maxMoodLabel }
      const hourMap = {};
      for (let hour = 0; hour < 24; hour++) {
        // Sum mood counts for all 4 intervals in this hour
        const moodSums = {};
        for (let i = 0; i < 4; i++) {
          const intervalIdx = hour * 4 + i;
          const moodCounts = intervals[intervalIdx] || {};
          for (const [mood, count] of Object.entries(moodCounts)) {
            moodSums[mood] = (moodSums[mood] || 0) + count;
          }
        }
        // Find max mood for this hour
        let maxMood = null;
        let maxCount = -1;
        for (const [mood, count] of Object.entries(moodSums)) {
          if (count > maxCount) {
            maxMood = mood;
            maxCount = count;
          }
        }
        hourMap[hour] = maxMood;
      }
      result[date] = hourMap;
    }
    return result;
  });

  return {
    moodTimelineDaily,
    setMoodTimelineDaily,
    clearMoodTimelineDaily,
    moodTimelineLabels,
  };
});
