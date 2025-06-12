import { ref, reactive, watch } from 'vue'
import type { AppSettings } from '@/types'

const STORAGE_KEY = 'app-settings'

const defaultSettings: AppSettings = {
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

/**
 * Composable for managing application settings
 */
export function useSettings() {
  const settings = reactive<AppSettings>({ ...defaultSettings })
  const isLoading = ref(false)
  const hasUnsavedChanges = ref(false)

  const loadSettings = async () => {
    isLoading.value = true
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        Object.assign(settings, { ...defaultSettings, ...parsedSettings })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveSettings = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      hasUnsavedChanges.value = false
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  }

  const resetSettings = () => {
    Object.assign(settings, { ...defaultSettings })
    hasUnsavedChanges.value = true
  }

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2)
  }

  const importSettings = (settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson)
      Object.assign(settings, { ...defaultSettings, ...importedSettings })
      hasUnsavedChanges.value = true
      return true
    } catch (error) {
      console.error('Failed to import settings:', error)
      return false
    }
  }

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    settings[key] = value
    hasUnsavedChanges.value = true
  }

  const updateNestedSetting = <
    K extends keyof AppSettings,
    NK extends keyof AppSettings[K]
  >(
    key: K,
    nestedKey: NK,
    value: AppSettings[K][NK]
  ) => {
    if (typeof settings[key] === 'object' && settings[key] !== null) {
      ;(settings[key] as any)[nestedKey] = value
      hasUnsavedChanges.value = true
    }
  }

  // Watch for changes to mark as unsaved
  watch(
    settings,
    () => {
      hasUnsavedChanges.value = true
    },
    { deep: true }
  )

  // Auto-save functionality
  const enableAutoSave = (intervalMs: number = 30000) => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges.value) {
        saveSettings()
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }

  return {
    settings,
    isLoading,
    hasUnsavedChanges,
    loadSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
    updateSetting,
    updateNestedSetting,
    enableAutoSave
  }
}
