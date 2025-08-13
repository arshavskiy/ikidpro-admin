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
        style="width: 900px"
        :title="editing ? 'Edit Rule' : 'Create Rule'"
        :bordered="false"
      >
        <div class="space-y-4">
          <!-- Validation Errors -->
          <div
            v-if="validationErrors.length > 0"
            class="bg-red-50 border border-red-200 rounded p-3"
          >
            <h4 class="text-sm font-medium text-red-800 mb-2">
              Validation Errors:
            </h4>
            <ul class="text-sm text-red-700 list-disc list-inside">
              <li v-for="error in validationErrors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>

          <n-input v-model:value="form.name" placeholder="Rule name" />

          <!-- Child Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Child (Optional)
            </label>
            <n-select
              v-model:value="form.aid"
              :options="childOptions"
              placeholder="Select a child (leave empty for all children)"
              clearable
              @update:value="onChildChange"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <n-select
              v-model:value="form.metric"
              :options="metricOptions"
              placeholder="Metric"
              @update:value="onMetricChange"
            />
            <n-select
              v-model:value="form.operator"
              :options="operatorOptions"
              placeholder="Operator"
            />
            <div class="space-y-2">
              <n-input-number
                v-model:value="form.threshold"
                placeholder="Threshold"
                :min="suggestedThresholds.min"
                :max="suggestedThresholds.max"
              />
              <div class="text-xs text-gray-500">
                Suggested: {{ suggestedThresholds.suggestions.join(", ") }}
              </div>
            </div>
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

          <!-- Rule Preview -->
          <div class="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 class="text-sm font-medium text-blue-800 mb-1">
              Rule Preview:
            </h4>
            <p class="text-sm text-blue-700">
              {{ formatRuleDescription(form) }}
            </p>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              {{ formValidation.isValid ? "✅ Valid rule" : "❌ Invalid rule" }}
            </div>
            <div class="flex space-x-2">
              <n-button @click="showEditor = false">Cancel</n-button>
              <n-button
                type="primary"
                :loading="saving"
                :disabled="!formValidation.isValid"
                @click="saveRule"
              >
                Save
              </n-button>
            </div>
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
import { useChildStore } from "@/stores/childStore";
import { bodyMetricOptions } from "@/models/models";
import {
  validateRule,
  formatRuleDescription,
  createDefaultRule,
  getSuggestedThresholds,
} from "@/services/controllers/rulesEngineController";
import { getAllChildUsers } from "@/services/childUserApi";

const store = useRulesStore();
const childStore = useChildStore();
const message = useMessage();

const loading = computed(() => store.loading);
const saving = computed(() => store.saving);
const rules = computed(() => store.rules);
const children = ref([]);

const search = ref("");
const showEditor = ref(false);
const editing = ref(false);
const validationErrors = ref([]);
const form = ref({
  name: "",
  metric: "Temperature",
  operator: ">",
  threshold: 38,
  label: "High Temp",
  description: "",
  enabled: true,
  aid: null,
  parentId: null,
});

// Watch for metric changes to update suggested thresholds
const suggestedThresholds = computed(() => {
  return getSuggestedThresholds(form.value.metric);
});

// Validate form in real-time
const formValidation = computed(() => {
  return validateRule(form.value);
});

const metricOptions = bodyMetricOptions;
const operatorOptions = [
  { label: ">", value: ">" },
  { label: ">=", value: ">=" },
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: "==", value: "==" },
  { label: "!=", value: "!=" },
];

// Child options for the selector
const childOptions = computed(() => {
  return children.value.map((child) => ({
    label: `${child.firstName} ${child.lastName} (${child.aid || child._id})`,
    value: child._id,
    parentId: child.parentId,
  }));
});

const columns = [
  { title: "Name", key: "name", width: 180 },
  {
    title: "Child",
    key: "child",
    width: 140,
    render(row) {
      if (!row.aid) return "All Children";
      const child = children.value.find((c) => c._id === row.aid);
      return child ? `${child.firstName} ${child.lastName}` : row.aid;
    },
  },
  {
    title: "Condition",
    key: "condition",
    render(row) {
      return formatRuleDescription(row);
    },
  },
  { title: "Label", key: "label", width: 140 },
  {
    title: "Enabled",
    key: "enabled",
    width: 100,
    render(row) {
      return row.enabled ? "✅ Yes" : "❌ No";
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
  form.value = createDefaultRule("Temperature");
  // Add the aid and parentId fields to the default rule
  form.value.aid = null;
  form.value.parentId = null;
  form.value._id = null;
  validationErrors.value = [];
  showEditor.value = true;
};

const onChildChange = (childId) => {
  if (childId) {
    const selectedChild = children.value.find((child) => child._id === childId);
    if (selectedChild) {
      form.value.parentId = selectedChild.parentId;
    }
  } else {
    form.value.parentId = null;
  }
};

const onMetricChange = () => {
  // Update threshold to a suggested value when metric changes
  const suggestions = getSuggestedThresholds(form.value.metric);
  form.value.threshold =
    suggestions.suggestions[suggestions.suggestions.length - 1];

  // Update label and name based on new metric
  const metricOption = bodyMetricOptions.find(
    (option) => option.value === form.value.metric
  );
  const metricLabel = metricOption ? metricOption.label : form.value.metric;
  form.value.label = `High ${metricLabel}`;

  if (!editing.value) {
    form.value.name = `${metricLabel} Alert`;
  }
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
  // Validate the rule before saving
  const validation = validateRule(form.value);
  if (!validation.isValid) {
    validationErrors.value = validation.errors;
    message.error(`Validation failed: ${validation.errors.join(", ")}`);
    return;
  }

  validationErrors.value = [];

  try {
    if (editing.value) {
      await store.updateRule(form.value.aid, form.value);
    } else {
      await store.createRule(form.value);
    }
    showEditor.value = false;
    message.success("Rule saved successfully");
  } catch (e) {
    console.error("Error saving rule:", e);
    message.error("Failed to save rule");
  }
};

const refresh = () => store.fetchRules();

const loadChildren = async () => {
  try {
    const response = await getAllChildUsers();
    children.value = response.data.data || response.data || [];
  } catch (error) {
    console.error("Error loading children:", error);
    children.value = [];
  }
};

onMounted(() => {
  refresh();
  loadChildren();
});
</script>
