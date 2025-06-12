<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Title Bar (for custom window controls if needed) -->
    <div v-if="showTitleBar" class="title-bar bg-white border-b border-gray-200 h-8 flex items-center justify-between px-4">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div class="text-sm font-medium text-gray-600">{{ appTitle }}</div>
      <div class="w-16"></div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary-600">Electron Vue3 Starter</h1>
            </div>
            <div class="flex space-x-4">
              <router-link
                v-for="route in navigationRoutes"
                :key="route.path"
                :to="route.path"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                :class="isActiveRoute(route.path) 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
              >
                {{ route.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">v{{ appVersion }}</span>
            <span class="text-sm text-gray-500">{{ platform }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- About Modal -->
    <AboutModal v-if="showAboutModal" @close="showAboutModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AboutModal from '@/components/AboutModal.vue'

const route = useRoute()
const showTitleBar = ref(false)
const appTitle = ref('Electron Vue3 Starter')
const appVersion = ref('1.0.0')
const platform = ref('unknown')
const showAboutModal = ref(false)

const navigationRoutes = [
  { path: '/', name: 'Home' },
  { path: '/features', name: 'Features' },
  { path: '/settings', name: 'Settings' }
]

const isActiveRoute = (path: string): boolean => {
  return route.path === path
}

const handleShowAbout = () => {
  showAboutModal.value = true
}

onMounted(async () => {
  // Get app information
  if (window.electronAPI) {
    try {
      appVersion.value = await window.electronAPI.getVersion()
      platform.value = await window.electronAPI.getPlatform()
    } catch (error) {
      console.error('Failed to get app info:', error)
    }

    // Listen for about dialog
    window.electronAPI.onShowAbout(handleShowAbout)
  }

  // Show title bar on Windows/Linux if needed
  showTitleBar.value = platform.value !== 'darwin'
})

onUnmounted(() => {
  if (window.electronAPI) {
    window.electronAPI.removeAllListeners('show-about')
  }
})
</script>

<style scoped>
.title-bar {
  -webkit-app-region: drag;
  user-select: none;
}

.title-bar > * {
  -webkit-app-region: no-drag;
}
</style>
