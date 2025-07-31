<!-- filepath: e:\Projects\IKidPro\front\src\components\KidPage.vue -->
<template>
  <div>
    <section class="p-4 bg-gray-100 content-center">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">KidPro</h1>
        <button
          @click="handleLogout"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <!-- <form @submit.prevent="addItem" class="mb-4 flex gap-2">
        <input
          v-model="form.kid_id"
          placeholder="kid_id"
          class="border px-2"
          required
        />
        <input
          v-model.number="form.age"
          placeholder="age"
          type="number"
          class="border px-2"
        />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form> -->
      <form @submit.prevent="getItem" class="mb-4 flex gap-2">
        <input
          v-model="form.kid_id"
          placeholder="kid_id"
          class="border px-2"
          required
        />
        <input
          v-model.filter="form.filter"
          placeholder="filter"
          class="border px-2"
        />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
          Get
        </button>
      </form>

      <!-- <form @submit.prevent="addItem" class="mb-4 flex gap-2">
      <input
        v-model="form.kid_id"
        placeholder="kid_id"
        class="border px-2"
        required
      />
      <input
        v-model.number="form.age"
        placeholder="age"
        type="number"
        class="border px-2"
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form> -->
      <div v-if="loading">Loading...</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>

      <EventTimestampChart v-if="items.length" :items="items" />

      <ul id="items" class="mb-4" v-if="showItems">
        <li
          v-for="item in items"
          :key="item._id"
          class="mb-2 flex gap-2 items-center"
        >
          <span
            >{{ item.kid_id }} Name: {{ item.kid_name }} (Age:
            {{ item.age }})</span
          >
          <button
            @click="deleteItem(item._id)"
            class="bg-red-500 text-white px-2 rounded"
          >
            Delete
          </button>
        </li>
      </ul>

      <ul id="grouped_items">
        <li
          v-for="item in groupedItems[form.kid_id] || []"
          :key="item._id"
          class="mb-2 flex gap-2 items-center"
        >
          <span
            >{{ item.kid_id }} Name: {{ item.kid_name }} (Age:
            {{ item.age }})</span
          >
          <button
            @click="deleteItem(item._id)"
            class="bg-red-500 text-white px-2 rounded"
          >
            Delete
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as api from "../services/kidproApi";
import EventTimestampChart from "../components/EventTimestampChart.vue";
import { useKidProStore } from "../stores/kidpro";
import { useUserStore } from "../stores/userStore";

import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const userKidStore = useKidProStore();

const items = ref([]);
const groupedItems = ref({});
const loading = ref(false);
const error = ref(null);
const showItems = ref(true);
const form = ref({ kid_id: "", age: null, filter: "" });

async function handleLogout() {
  await userStore.logout();
  router.push("/login");
}

// Fetch all items (GET)
async function fetchAll() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.getAll();
    items.value = res.data;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

// Create item (POST)
async function addItem() {
  error.value = null;
  try {
    await api.create({ ...form.value });
    // await fetchAll();
    form.value.kid_id = "";
    form.value.age = null;
  } catch (e) {
    error.value = e.message;
  }
}

// Delete item (DELETE)
async function deleteItem() {
  error.value = null;
  try {
    await api.remove(id);
    await fetchAll();
  } catch (e) {
    error.value = e.message;
  }
}

// Update item (PUT)
async function updateItem(id, data) {
  error.value = null;
  try {
    await api.update(id, data);
    await fetchAll();
  } catch (e) {
    error.value = e.message;
  }
}

// Get item by id (GET)
async function getItem() {
  error.value = null;
  showItems.value = false;
  try {
    const id = form.value.kid_id;

    const res = await api.getById(id);
    const groups = {};
    res.data.forEach((item) => {
      const kidId = item.kid_id;
      if (!groups[kidId]) groups[kidId] = [];
      groups[kidId].push(item);
    });

    groupedItems.value = groups;
    items.value = res.data;
  } catch (e) {
    error.value = e.message;
    return null;
  }
}

onMounted(async () => {
  if (!userStore.isAuthenticated) {
    return;
  }

  await userStore.fetchUserInfo();
  // await fetchAll();
});
</script>
