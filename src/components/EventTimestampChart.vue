<!-- filepath: e:\Projects\IKidPro\front\src\components\EventTimestampChart.vue -->
<template>
  <div>
    <div class="mb-4 flex flex-wrap gap-2">
      <label
        v-for="(key, idx) in objectKeys"
        :key="idx"
        class="flex items-center gap-1"
      >
        <input type="checkbox" :value="idx" v-model="selectedIndices" />
        {{ key }}
      </label>
    </div>
  </div>

  <div class="w-full h-96">
    <v-chart :option="option" autoresize />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import VChart from "vue-echarts";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

// const selectedIndices = ref(props.items.map((_, idx) => idx)); // All selected by default
const selectedIndices = ref([]); // All selected by default

const option = ref({
  title: { text: `${props.items[0].kid_name} (${props.items[0].age} years)` },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      rotate: 90, // Rotate X-axis labels to vertical
    },
  },
  yAxis: [
    {
      type: "value",
      name: "",
      min: 0,
      max: 220,
      position: "left",
      axisLine: {
        show: true,
        lineStyle: { color: "#5470C6", fontWeigh: "bold", fontSize: "14px" },
      },
    },
    {
      type: "value",
      name: "",
      min: 0,
      max: 10,
      position: "right",
      axisLine: { show: true, lineStyle: { color: "#ff0000" } },
    },
  ],
  series: [
    {
      name: "",
      type: "line",
      data: [],
      smooth: false,
      yAxisIndex: 0,
    },
    {
      name: "",
      type: "line",
      data: [],
      smooth: false,
      yAxisIndex: 1,
    },
  ],
  dataZoom: [
    {
      type: "slider",
      show: true,
      start: 0,
      end: 100, // default visible range
    },
    {
      type: "inside", // allows zooming with mouse/touch
    },
  ],
});
let objectKeys = ref(Object.keys(props.items[0] || []));
objectKeys.value = objectKeys.value.filter((key) => {
  return (
    key !== "date" &&
    key !== "kid_id" &&
    key !== "age" &&
    key !== "_id" &&
    key !== "created_at" &&
    key !== "updated_at" &&
    key !== "event_timestamp" &&
    key !== "race" &&
    key !== "city" &&
    key !== "geofence_status" &&
    key !== "event_timestamp" &&
    key !== "weather" &&
    !key.includes("location") &&
    !key.includes("name") &&
    !key.includes("status") &&
    !key.includes("type")
  );
});

// props.items = props.items.map(item => item.filter(elm =>  typeof elm  === "number"));

function prepareChartData() {
  // Sort items by date

  // Filter out items without date
  const sorted = [...props.items].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // option.value.xAxis.data = sorted.map((item) => item.date.toLocaleString());
  // option.value.series[0].data = sorted.map((item) => item.heart_rate_bpm || 0); // Example: plot age vs timestamp
  // option.value.series[1].data = sorted.map((item) => item.motion_level || 0); // Example: plot age vs timestamp

  console.log("selectedIndices", selectedIndices.value);
  console.log(
    "objectKeys",
    objectKeys.value[selectedIndices.value[selectedIndices.value.length - 1]]
  );
  option.value.series.forEach((series) => (series.data = []));
  option.value.yAxis.forEach((yAxis) => {
    yAxis.name = "";
    // yAxis.max = 10;
    yAxis.min = 0;
  });

  let selectedStateSum = Object.keys(selectedIndices.value).length === 1;

  option.value.xAxis.data = sorted.map((item) => item.date.toLocaleString());

  if (Object.keys(selectedIndices.value).length === 0) {
    option.value.series = [
      {
        name: "Heart Rate",
        type: "line",
        data: [],
        smooth: false,
        yAxisIndex: 0,
      },
      {
        name: "Motion Level",
        type: "line",
        data: [],
        smooth: false,
        yAxisIndex: 1,
      },
    ];
    // option.value.xAxis.data = sorted.map((item) => item.date);

    option.value.series[0].data = sorted.map(
      (item) => item.heart_rate_bpm || 0
    ); // Example: plot age vs timestamp
    option.value.series[1].data = sorted.map((item) => item.motion_level || 0); // Example: plot age vs timestamp

    option.value.yAxis = [
      {
        type: "value",
        name: "",
        min: 0,
        max: 220,
        position: "left",
        axisLine: {
          show: true,
          lineStyle: { color: "#5470C6", fontWeigh: "bold", fontSize: "14px" },
        },
      },
      {
        type: "value",
        name: "",
        min: 0,
        max: 10,
        position: "right",
        axisLine: { show: true, lineStyle: { color: "#ff0000" } },
      },
    ];
  } else {
    let MM = 0;

    if (selectedStateSum) {
      option.value.series[Object.keys(selectedIndices.value)] = {
        name: "",
        type: "line",
        data: [],
        smooth: false,
        yAxisIndex: 1,
      };
    }

    selectedIndices.value.forEach((key, index) => {
      option.value.series[index] = {
        name: objectKeys.value[key],
        type: "line",
        data: sorted.map((item) => item[objectKeys.value[key]] || 0),
        yAxisIndex: selectedStateSum ? 1 : index,
      };

      if (option.value.yAxis[index]) {
        option.value.yAxis[index].name = objectKeys.value[key];
        const M = Math.max(
          ...sorted.map((item) => item[objectKeys.value[key]] || 0)
        );
        option.value.yAxis[index].max = M + M / 10;
        option.value.yAxis[index].min = 0;
        if (M > MM) {
          MM = M;
        }
        option.value.yAxis[index].max = MM + MM / 10;

        console.log(option.value.yAxis[index]);
      } else {
        option.value.yAxis.push({
          type: "value",
          name: objectKeys.value[key],
          min: 0,
          max: 10,
          position: "right",
        });

        option.value.yAxis[index].name = objectKeys.value[key];
        const M = Math.max(
          ...sorted.map((item) => item[objectKeys.value[key]] || 0)
        );
        option.value.yAxis[index].max = M + M / 10;
        option.value.yAxis[index].min = 0;
        if (M > MM) {
          MM = M;
        }
        option.value.yAxis[index].max = MM + MM / 10;

        console.log(option.value.yAxis[index]);
      }
    });

    // option.value.yAxis[0].max = Math.max(...option.value.yAxis(item => item.max));
  }
}

// watch(() => props.items, prepareChartData, { immediate: true });
watch([() => props.items, selectedIndices], prepareChartData, {
  immediate: true,
});
onMounted(prepareChartData);
</script>
