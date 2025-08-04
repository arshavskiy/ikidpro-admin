<template>
  <div class="naive-ui-demo p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Naive UI Demo Components
    </h2>

    <!-- Buttons Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Buttons</h3>
      <div class="flex gap-4 flex-wrap">
        <n-button type="default">Default</n-button>
        <n-button type="primary">Primary</n-button>
        <n-button type="info">Info</n-button>
        <n-button type="success">Success</n-button>
        <n-button type="warning">Warning</n-button>
        <n-button type="error">Error</n-button>
      </div>
    </div>

    <!-- Input Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Input Fields</h3>
      <div class="space-y-4 max-w-md">
        <n-input v-model:value="inputValue" placeholder="Basic input" />
        <n-input
          v-model:value="passwordValue"
          type="password"
          placeholder="Password input"
        />
        <n-input-number
          v-model:value="numberValue"
          placeholder="Number input"
        />
      </div>
    </div>

    <!-- Select Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Select</h3>
      <div class="max-w-md">
        <n-select
          v-model:value="selectValue"
          :options="selectOptions"
          placeholder="Select an option"
        />
      </div>
    </div>

    <!-- Date Picker Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Date Picker</h3>
      <div class="max-w-md">
        <n-date-picker v-model:value="dateValue" type="date" />
      </div>
    </div>

    <!-- Card Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Card</h3>
      <n-card title="Sample Card" class="max-w-md">
        <template #header-extra>
          <n-button size="small">Action</n-button>
        </template>
        This is the content of the card. Naive UI provides beautiful and
        accessible components.
      </n-card>
    </div>

    <!-- Table Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Data Table</h3>
      <n-data-table
        :columns="tableColumns"
        :data="tableData"
        :pagination="false"
      />
    </div>

    <!-- Message Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Messages</h3>
      <div class="flex gap-4 flex-wrap">
        <n-button @click="showMessage('info')">Info Message</n-button>
        <n-button @click="showMessage('success')">Success Message</n-button>
        <n-button @click="showMessage('warning')">Warning Message</n-button>
        <n-button @click="showMessage('error')">Error Message</n-button>
      </div>
    </div>

    <!-- Loading Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Loading</h3>
      <n-spin :show="showLoading">
        <n-card class="max-w-md">
          <div class="h-32 flex items-center justify-center">
            <div>Content that can be in loading state</div>
          </div>
        </n-card>
      </n-spin>
      <div class="mt-4">
        <n-button @click="toggleLoading">Toggle Loading</n-button>
      </div>
    </div>

    <!-- Form Demo -->
    <div class="demo-section">
      <h3 class="text-lg font-semibold mb-4">Form</h3>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="formRules"
        class="max-w-md"
      >
        <n-form-item path="name" label="Name">
          <n-input
            v-model:value="formValue.name"
            placeholder="Enter your name"
          />
        </n-form-item>
        <n-form-item path="email" label="Email">
          <n-input
            v-model:value="formValue.email"
            placeholder="Enter your email"
          />
        </n-form-item>
        <n-form-item path="age" label="Age">
          <n-input-number
            v-model:value="formValue.age"
            placeholder="Enter your age"
          />
        </n-form-item>
        <div class="flex gap-4">
          <n-button type="primary" @click="handleValidateClick">
            Validate
          </n-button>
          <n-button @click="handleResetClick">Reset</n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";

const message = useMessage();

// Basic inputs
const inputValue = ref("");
const passwordValue = ref("");
const numberValue = ref(null);

// Select
const selectValue = ref(null);
const selectOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

// Date picker
const dateValue = ref(null);

// Loading
const showLoading = ref(false);

// Table
const tableColumns = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
  { title: "Address", key: "address" },
];

const tableData = [
  { key: 0, name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: 1, name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: 2, name: "Joe Black", age: 32, address: "Sidney No. 1 Lake Park" },
];

// Form
const formRef = ref(null);
const formValue = ref({
  name: "",
  email: "",
  age: null,
});

const formRules = {
  name: {
    required: true,
    message: "Please input your name",
    trigger: ["input", "blur"],
  },
  email: {
    required: true,
    message: "Please input your email",
    trigger: ["input", "blur"],
  },
  age: {
    required: true,
    type: "number",
    message: "Please input your age",
    trigger: ["input", "blur"],
  },
};

// Methods
const showMessage = (type) => {
  message[type](`This is a ${type} message!`);
};

const toggleLoading = () => {
  showLoading.value = !showLoading.value;
};

const handleValidateClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success("Form is valid!");
    } else {
      message.error("Form has errors");
    }
  });
};

const handleResetClick = () => {
  formValue.value = {
    name: "",
    email: "",
    age: null,
  };
};
</script>

<style scoped>
.naive-ui-demo {
  max-width: 800px;
  margin: 0 auto;
}

.demo-section {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.demo-section h3 {
  color: #374151;
  margin-bottom: 1rem;
}
</style>
