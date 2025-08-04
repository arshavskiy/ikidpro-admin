import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

// Naive UI
import naive from "naive-ui";

// Vfonts - Naive UI Typography
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import "./assets/main.css";

// ECharts initialization
import { initECharts } from "./utils/echarts-config.js";

// Initialize ECharts with error handling
initECharts();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(naive);
app.mount("#app");
