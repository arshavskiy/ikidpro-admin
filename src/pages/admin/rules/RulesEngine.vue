<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Rules Engine</h2>
        <p class="text-gray-600">
          Define rules for body metrics (e.g., high temp, low BP)
        </p>
      </div>
      <div class="flex space-x-2">
        <n-button type="primary" @click="openCreate">New Rule</n-button>
        <n-button @click="refresh" :loading="loading">Refresh</n-button>
      </div>
    </div>

    <n-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Existing Rules</h3>
          <n-input
            v-model:value="search"
            placeholder="Search rules..."
            clearable
            style="max-width: 280px"
          />
        </div>
      </template>

      <n-data-table
        :columns="columns"
        :data="filteredRules"
        :loading="loading"
        :row-key="(r) => r._id"
      />
    </n-card>

    <n-modal v-model:show="showEditor">
      <n-card
        style="width: 700px"
        :title="editing ? 'Edit Rule' : 'Create Rule'"
        :bordered="false"
      >
        <div class="space-y-4">
          <n-input v-model:value="form.name" placeholder="Rule name" />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <n-select
              v-model:value="form.metric"
              :options="metricOptions"
              placeholder="Metric"
            />
            <n-select
              v-model:value="form.operator"
              :options="operatorOptions"
              placeholder="Operator"
            />
            <n-input-number
              v-model:value="form.threshold"
              placeholder="Threshold"
            />
          </div>
          <n-input
            v-model:value="form.label"
            placeholder="Label (e.g., High Temp)"
          />
          <n-input
            type="textarea"
            v-model:value="form.description"
            placeholder="Description"
            :rows="3"
          />
          <div class="flex items-center space-x-3">
            <n-switch v-model:value="form.enabled" />
            <span class="text-sm text-gray-700">Enabled</span>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <n-button @click="showEditor = false">Cancel</n-button>
            <n-button type="primary" :loading="saving" @click="saveRule"
              >Save</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NSelect,
  NModal,
  NSwitch,
  NInputNumber,
  useMessage,
} from "naive-ui";
import { useRulesStore } from "@/stores/rulesStore";

const store = useRulesStore();
const message = useMessage();

const loading = computed(() => store.loading);
const saving = computed(() => store.saving);
const rules = computed(() => store.rules);

const search = ref("");
const showEditor = ref(false);
const editing = ref(false);
const form = ref({
  _id: null,
  name: "",
  metric: "Temperature",
  operator: ">",
  threshold: 38,
  label: "High Temp",
  description: "",
  enabled: true,
});

const metricOptions = [
  { label: "Temperature (°C)", value: "Temperature" },
  { label: "Heart Rate (bpm)", value: "HeartRate" },
  { label: "SpO2 (%)", value: "Sp02" },
  { label: "EDA (μS)", value: "EDA" },
  { label: "Respiratory Rate", value: "respiratoryRate" },
  { label: "Humidity (%)", value: "humidity" },
  { label: "Pressure (hPa)", value: "pressure" },
];
const operatorOptions = [
  { label: ">", value: ">" },
  { label: ">=", value: ">=" },
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: "==", value: "==" },
  { label: "!=", value: "!=" },
];

const columns = [
  { title: "Name", key: "name", width: 180 },
  {
    title: "Condition",
    key: "condition",
    render(row) {
      return `${row.metric} ${row.operator} ${row.threshold}`;
    },
  },
  { title: "Label", key: "label", width: 140 },
  {
    title: "Enabled",
    key: "enabled",
    width: 100,
    render(row) {
      return row.enabled ? "Yes" : "No";
    },
  },
  {
    title: "Updated",
    key: "updatedAt",
    width: 180,
    render(row) {
      return new Date(row.updatedAt || row.createdAt).toLocaleString();
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 220,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            onClick: () => editRule(row),
            style: { marginRight: "6px" },
          },
          { default: () => "Edit" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            secondary: true,
            onClick: () => removeRule(row),
          },
          { default: () => "Delete" }
        ),
      ];
    },
  },
];

const filteredRules = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rules.value;
  return rules.value.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(q) ||
      (r.label || "").toLowerCase().includes(q) ||
      `${r.metric} ${r.operator} ${r.threshold}`.toLowerCase().includes(q)
  );
});

const openCreate = () => {
  editing.value = false;
  form.value = {
    _id: null,
    name: "",
    metric: "Temperature",
    operator: ">",
    threshold: 38,
    label: "High Temp",
    description: "",
    enabled: true,
  };
  showEditor.value = true;
};
const editRule = (row) => {
  editing.value = true;
  form.value = { ...row };
  showEditor.value = true;
};
const removeRule = async (row) => {
  try {
    await store.deleteRule(row._id);
    message.success("Rule deleted");
  } catch (e) {
    message.error("Failed to delete");
  }
};

const saveRule = async () => {
  try {
    if (editing.value) await store.updateRule(form.value._id, form.value);
    else await store.createRule(form.value);
    showEditor.value = false;
    message.success("Rule saved");
  } catch (e) {
    message.error("Failed to save rule");
  }
};

const refresh = () => store.fetchRules();

onMounted(() => refresh());
</script>
