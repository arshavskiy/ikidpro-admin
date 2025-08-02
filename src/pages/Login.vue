<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Data Flow Lines -->
      <div class="absolute top-0 left-0 w-full h-full opacity-20">
        <div class="animate-pulse">
          <svg
            class="w-full h-full"
            viewBox="0 0 1000 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Neural Network Style Lines -->
            <line
              x1="100"
              y1="100"
              x2="300"
              y2="200"
              stroke="url(#gradient1)"
              stroke-width="2"
              opacity="0.6"
            />
            <line
              x1="300"
              y1="200"
              x2="500"
              y2="150"
              stroke="url(#gradient1)"
              stroke-width="2"
              opacity="0.6"
            />
            <line
              x1="500"
              y1="150"
              x2="700"
              y2="250"
              stroke="url(#gradient1)"
              stroke-width="2"
              opacity="0.6"
            />
            <line
              x1="150"
              y1="300"
              x2="350"
              y2="400"
              stroke="url(#gradient2)"
              stroke-width="2"
              opacity="0.5"
            />
            <line
              x1="350"
              y1="400"
              x2="550"
              y2="350"
              stroke="url(#gradient2)"
              stroke-width="2"
              opacity="0.5"
            />
            <line
              x1="550"
              y1="350"
              x2="750"
              y2="450"
              stroke="url(#gradient2)"
              stroke-width="2"
              opacity="0.5"
            />

            <!-- Data Nodes -->
            <circle
              cx="100"
              cy="100"
              r="4"
              fill="#3b82f6"
              opacity="0.8"
              class="animate-pulse"
            />
            <circle
              cx="300"
              cy="200"
              r="6"
              fill="#06b6d4"
              opacity="0.8"
              class="animate-pulse"
            />
            <circle
              cx="500"
              cy="150"
              r="5"
              fill="#8b5cf6"
              opacity="0.8"
              class="animate-pulse"
            />
            <circle
              cx="700"
              cy="250"
              r="4"
              fill="#10b981"
              opacity="0.8"
              class="animate-pulse"
            />

            <!-- Gradients -->
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #3b82f6; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #06b6d4; stop-opacity: 0.3"
                />
              </linearGradient>
              <linearGradient
                id="gradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #8b5cf6; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #10b981; stop-opacity: 0.3"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- Floating Data Particles -->
      <div
        class="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60"
      ></div>
      <div
        class="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-40"
      ></div>
      <div
        class="absolute bottom-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"
      ></div>
      <div
        class="absolute top-60 right-40 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-50"
      ></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo with Data Visualization Theme -->
        <div class="mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 relative overflow-hidden"
          >
            <!-- Circuit Pattern -->
            <svg
              class="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
            <!-- Animated Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 opacity-20 animate-pulse rounded-2xl"
            ></div>
          </div>

          <!-- App Name with Futuristic Typography -->
          <h1
            class="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            IkidPro
          </h1>
          <div
            class="text-cyan-300 text-sm font-medium tracking-wider uppercase"
          >
            Body metrics Analytics Platform
          </div>
        </div>

        <!-- Data-Driven Tagline -->
        <div
          class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mb-8 border border-slate-700/50"
        >
          <div
            class="flex items-center justify-center space-x-3 text-slate-300"
          >
            <div class="flex items-center space-x-1">
              <div
                class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              ></div>
              <span class="text-xs font-mono">LIVE</span>
            </div>
            <div class="text-slate-600">|</div>
            <div class="text-xs font-mono">
              Real-time BodyMetric Intelligence
            </div>
          </div>

          <!-- Mini Data Visualization -->
          <div class="flex justify-center items-center mt-3 space-x-1">
            <div
              class="w-1 h-6 bg-blue-400 rounded-full opacity-60 animate-pulse"
            ></div>
            <div
              class="w-1 h-4 bg-cyan-400 rounded-full opacity-70 animate-pulse"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-1 h-8 bg-purple-400 rounded-full opacity-60 animate-pulse"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-1 h-5 bg-green-400 rounded-full opacity-70 animate-pulse"
              style="animation-delay: 0.3s"
            ></div>
            <div
              class="w-1 h-7 bg-blue-400 rounded-full opacity-60 animate-pulse"
              style="animation-delay: 0.4s"
            ></div>
            <div
              class="w-1 h-3 bg-cyan-400 rounded-full opacity-70 animate-pulse"
              style="animation-delay: 0.5s"
            ></div>
            <div
              class="w-1 h-6 bg-purple-400 rounded-full opacity-60 animate-pulse"
              style="animation-delay: 0.6s"
            ></div>
          </div>
        </div>
      </div>
      <!-- Futuristic Login Form -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Glass Morphism Container -->
        <div
          class="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl"
        >
          <p class="text-slate-400 text mb-4 text-center">
            Enter your credentials to access
          </p>
          <!-- Input Fields -->
          <div class="space-y-6">
            <!-- Email Field -->
            <div class="relative">
              <label
                class="text-sm font-medium text-cyan-400 mb-2 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Email"
                autocomplete="email"
              />
              <!-- Animated Border Effect -->
              <div
                class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-600/20 opacity-0 transition-opacity duration-200 pointer-events-none"
              ></div>
            </div>

            <!-- Password Field -->
            <div class="relative">
              <label
                class="text-sm font-medium text-cyan-400 mb-2 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Password
              </label>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="••••••••••••"
                autocomplete="current-password"
              />
            </div>
          </div>

          <!-- Login Button -->
          <div class="mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <!-- Loading Spinner -->
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>

              <!-- Access Icon -->
              <svg
                v-if="!loading"
                class="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>

              {{ loading ? "Authenticating..." : "Access Dashboard" }}

              <!-- Hover Effect Arrow -->
              <svg
                v-if="!loading"
                class="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Security Notice -->
          <div
            class="mt-6 flex items-center justify-center text-xs text-slate-400"
          >
            <svg
              class="w-4 h-4 mr-2 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            End-to-end encrypted authentication
          </div>
        </div>
      </form>
      <div v-if="error" class="mt-2 text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  try {
    await userStore.login({
      email: email.value,
      password: password.value,
    });

    const redirectPath = route.query.redirect || "/admin/analytics/events";
    router.push(redirectPath);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Futuristic Login Animations */
@keyframes float-particles {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) translateX(-5px);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-15px) translateX(10px);
    opacity: 0.4;
  }
}

@keyframes neural-pulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes data-flow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 211, 238, 0.6);
  }
}

/* Floating Particles */
.particle {
  animation: float-particles 6s ease-in-out infinite;
}

.particle:nth-child(2) {
  animation-delay: -1s;
  animation-duration: 8s;
}

.particle:nth-child(3) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.particle:nth-child(4) {
  animation-delay: -3s;
  animation-duration: 9s;
}

/* Neural Network Animation */
.neural-pattern {
  animation: neural-pulse 4s ease-in-out infinite;
}

/* Gradient Background Animation */
.gradient-animated {
  background-size: 400% 400%;
  animation: gradient-shift 8s ease infinite;
}

/* Data Flow Animation */
.data-stream {
  animation: data-flow 3s linear infinite;
}

/* Input Focus Effects */
.form-input:focus + .border-effect {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.8);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #22d3ee, #3b82f6);
  border-radius: 2px;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .data-viz-bar {
    height: 20px;
  }

  .particle {
    width: 3px;
    height: 3px;
  }
}

/* Glass Morphism Enhancement */
.glass-panel {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Circuit Pattern */
.circuit-pattern {
  background-image: radial-gradient(
      circle at 25% 25%,
      rgba(34, 211, 238, 0.1) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(147, 51, 234, 0.1) 2px,
      transparent 2px
    );
  background-size: 40px 40px;
}

/* Holographic Text Effect */
.holographic-text {
  background: linear-gradient(45deg, #22d3ee, #a855f7, #22d3ee);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
