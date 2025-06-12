<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
      <p class="text-lg text-gray-600">
        Configure your application preferences and settings
      </p>
    </div>

    <!-- Appearance Settings -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="settings.theme = theme.value"
              class="p-4 border-2 rounded-lg transition-all duration-200"
              :class="settings.theme === theme.value 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center space-x-3">
                <div :class="theme.color" class="w-4 h-4 rounded-full"></div>
                <span class="font-medium">{{ theme.label }}</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Small</span>
            <input
              v-model="settings.fontSize"
              type="range"
              min="12"
              max="20"
              step="1"
              class="flex-1"
            />
            <span class="text-sm text-gray-500">Large</span>
            <span class="text-sm font-medium w-12">{{ settings.fontSize }}px</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Desktop Notifications</h3>
            <p class="text-sm text-gray-600">Show notifications on your desktop</p>
          </div>
          <ToggleSwitch v-model="settings.notifications.desktop" />
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Sound Notifications</h3>
            <p class="text-sm text-gray-600">Play sound when notifications appear</p>
          </div>
          <ToggleSwitch v-model="settings.notifications.sound" />
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Auto-hide Notifications</h3>
            <p class="text-sm text-gray-600">Automatically hide notifications after 5 seconds</p>
          </div>
          <ToggleSwitch v-model="settings.notifications.autoHide" />
        </div>
      </div>
    </div>

    <!-- Performance Settings -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Performance</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Hardware Acceleration</h3>
            <p class="text-sm text-gray-600">Use GPU acceleration when available</p>
          </div>
          <ToggleSwitch v-model="settings.performance.hardwareAcceleration" />
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Background Processing</h3>
            <p class="text-sm text-gray-600">Continue processing when window is minimized</p>
          </div>
          <ToggleSwitch v-model="settings.performance.backgroundProcessing" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Memory Usage Limit</label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Low</span>
            <input
              v-model="settings.performance.memoryLimit"
              type="range"
              min="512"
              max="4096"
              step="256"
              class="flex-1"
            />
            <span class="text-sm text-gray-500">High</span>
            <span class="text-sm font-medium w-16">{{ settings.performance.memoryLimit }}MB</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Settings -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Privacy</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Analytics</h3>
            <p class="text-sm text-gray-600">Help improve the app by sharing usage data</p>
          </div>
          <ToggleSwitch v-model="settings.privacy.analytics" />
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-gray-900">Crash Reports</h3>
            <p class="text-sm text-gray-600">Automatically send crash reports</p>
          </div>
          <ToggleSwitch v-model="settings.privacy.crashReports" />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between">
      <button @click="resetSettings" class="btn btn-secondary">
        Reset to Defaults
      </button>
      <div class="space-x-3">
        <button @click="exportSettings" class="btn btn-secondary">
          Export Settings
        </button>
        <button @click="saveSettings" class="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>

    <!-- Settings Preview -->
    <div v-if="showPreview" class="card mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Settings Preview</h3>
      <pre class="text-sm bg-gray-100 p-4 rounded-lg overflow-auto">{{ JSON.stringify(settings, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

const showPreview = ref(false)

const themes = [
  { value: 'light', label: 'Light', color: 'bg-white border border-gray-300' },
  { value: 'dark', label: 'Dark', color: 'bg-gray-800' },
  { value: 'auto', label: 'Auto', color: 'bg-gradient-to-r from-white to-gray-800' }
]

const settings = reactive({
  theme: 'light',
  fontSize: 14,
  notifications: {
    desktop: true,
    sound: false,
    autoHide: true
  },
  performance: {
    hardwareAcceleration: true,
    backgroundProcessing: false,
    memoryLimit: 1024
  },
  privacy: {
    analytics: false,
    crashReports: true
  }
})

const defaultSettings = {
  theme: 'light',
  fontSize: 14,
  notifications: {
    desktop: true,
    sound: false,
    autoHide: true
  },
  performance: {
    hardwareAcceleration: true,
    backgroundProcessing: false,
    memoryLimit: 1024
  },
  privacy: {
    analytics: false,
    crashReports: true
  }
}

const resetSettings = () => {
  Object.assign(settings, JSON.parse(JSON.stringify(defaultSettings)))
}

const saveSettings = async () => {
  // In a real app, you would save to localStorage or send to main process
  localStorage.setItem('app-settings', JSON.stringify(settings))
  
  if (window.electronAPI) {
    await window.electronAPI.showMessageBox({
      type: 'info',
      title: 'Settings Saved',
      message: 'Your settings have been saved successfully!'
    })
  }
}

const exportSettings = async () => {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: 'app-settings.json',
        filters: [
          { name: 'JSON Files', extensions: ['json'] }
        ]
      })

      if (!result.canceled && result.filePath) {
        // 实际写入文件
        const settingsJson = JSON.stringify(settings, null, 2)
        const writeResult = await window.electronAPI.writeFile(result.filePath, settingsJson)

        if (writeResult.success) {
          await window.electronAPI.showMessageBox({
            type: 'info',
            title: 'Export Complete',
            message: `Settings successfully exported to: ${result.filePath}`
          })
        } else {
          await window.electronAPI.showMessageBox({
            type: 'error',
            title: 'Export Failed',
            message: `Failed to export settings: ${writeResult.error}`
          })
        }
      }
    } catch (error) {
      console.error('Failed to export settings:', error)
      if (window.electronAPI) {
        await window.electronAPI.showMessageBox({
          type: 'error',
          title: 'Export Error',
          message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
      }
    }
  }
}

// Load settings on component mount
const loadSettings = () => {
  const saved = localStorage.getItem('app-settings')
  if (saved) {
    try {
      Object.assign(settings, JSON.parse(saved))
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

// 应用主题设置
const applyTheme = (theme: string) => {
  const html = document.documentElement
  html.classList.remove('light', 'dark')

  if (theme === 'dark') {
    html.classList.add('dark')
  } else if (theme === 'light') {
    html.classList.add('light')
  } else {
    // auto theme - 检测系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.add(prefersDark ? 'dark' : 'light')
  }
}

// 应用字体大小设置
const applyFontSize = (fontSize: number) => {
  document.documentElement.style.fontSize = `${fontSize}px`
}

// 监听设置变化并应用
watch(() => settings.theme, (newTheme: string) => {
  applyTheme(newTheme)
}, { immediate: true })

watch(() => settings.fontSize, (newSize: number) => {
  applyFontSize(newSize)
}, { immediate: true })

// 初始化
onMounted(() => {
  loadSettings()
  applyTheme(settings.theme)
  applyFontSize(settings.fontSize)
})

loadSettings()
</script>
