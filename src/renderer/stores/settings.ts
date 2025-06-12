import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  notifications: {
    desktop: boolean
    sound: boolean
    autoHide: boolean
  }
  performance: {
    hardwareAcceleration: boolean
    backgroundProcessing: boolean
    memoryLimit: number
  }
  privacy: {
    analytics: boolean
    crashReports: boolean
  }
}

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

const STORAGE_KEY = 'app-settings'

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const settings = ref<AppSettings>({ ...defaultSettings })
  const isLoading = ref(false)
  const hasUnsavedChanges = ref(false)

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
      const appliedTheme = prefersDark ? 'dark' : 'light'
      html.classList.add(appliedTheme)
    }
  }

  // 应用字体大小设置
  const applyFontSize = (fontSize: number) => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }

  // 自动保存设置到 localStorage
  const autoSaveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('Failed to auto-save settings:', error)
    }
  }

  // 加载设置
  const loadSettings = () => {
    isLoading.value = true

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const savedSettings = JSON.parse(saved)
        settings.value = { ...defaultSettings, ...savedSettings }
      } else {
        settings.value = { ...defaultSettings }
      }
    } catch (error) {
      console.error('Failed to parse saved settings:', error)
      settings.value = { ...defaultSettings }
    } finally {
      isLoading.value = false
    }
  }

  // 手动保存设置
  const saveSettings = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
      hasUnsavedChanges.value = false

      if (window.electronAPI) {
        await window.electronAPI.showMessageBox({
          type: 'info',
          title: 'Settings Saved',
          message: 'Your settings have been saved successfully!'
        })
      }
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      if (window.electronAPI) {
        await window.electronAPI.showMessageBox({
          type: 'error',
          title: 'Save Failed',
          message: 'Failed to save settings. Please try again.'
        })
      }
      return false
    }
  }

  // 重置设置
  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    hasUnsavedChanges.value = true
  }

  // 导出设置
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
          const settingsJson = JSON.stringify(settings.value, null, 2)
          const writeResult = await window.electronAPI.writeFile(result.filePath, settingsJson)
          
          if (writeResult.success) {
            await window.electronAPI.showMessageBox({
              type: 'info',
              title: 'Export Complete',
              message: `Settings successfully exported to: ${result.filePath}`
            })
            return true
          } else {
            await window.electronAPI.showMessageBox({
              type: 'error',
              title: 'Export Failed',
              message: `Failed to export settings: ${writeResult.error}`
            })
            return false
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
        return false
      }
    }
    return false
  }

  // 初始化设置（加载并应用）
  const initializeSettings = () => {
    loadSettings()
    applyTheme(settings.value.theme)
    applyFontSize(settings.value.fontSize)
  }

  // 监听设置变化并自动应用 + 保存
  watch(() => settings.value.theme, (newTheme: string) => {
    applyTheme(newTheme)
    autoSaveSettings()
    hasUnsavedChanges.value = false
  }, { immediate: false })

  watch(() => settings.value.fontSize, (newSize: number) => {
    applyFontSize(newSize)
    autoSaveSettings()
    hasUnsavedChanges.value = false
  }, { immediate: false })

  // 监听其他设置变化
  watch(() => settings.value.notifications, () => {
    autoSaveSettings()
    hasUnsavedChanges.value = false
  }, { deep: true, immediate: false })

  watch(() => settings.value.performance, () => {
    autoSaveSettings()
    hasUnsavedChanges.value = false
  }, { deep: true, immediate: false })

  watch(() => settings.value.privacy, () => {
    autoSaveSettings()
    hasUnsavedChanges.value = false
  }, { deep: true, immediate: false })

  return {
    // 状态
    settings,
    isLoading,
    hasUnsavedChanges,
    
    // 方法
    loadSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    initializeSettings,
    applyTheme,
    applyFontSize
  }
})
