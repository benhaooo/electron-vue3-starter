import { ref, onMounted } from 'vue'
import type { SystemInfo } from '@/types'

/**
 * Composable for interacting with Electron APIs
 */
export function useElectron() {
  const isElectron = ref(false)
  const systemInfo = ref<SystemInfo | null>(null)

  const checkElectronAvailability = () => {
    isElectron.value = !!window.electronAPI
  }

  const getSystemInfo = async (): Promise<SystemInfo | null> => {
    if (!window.electronAPI) return null

    try {
      const [platform, version] = await Promise.all([
        window.electronAPI.getPlatform(),
        window.electronAPI.getVersion()
      ])

      const info: SystemInfo = {
        platform,
        version,
        electronVersion: process.versions?.electron || 'N/A',
        nodeVersion: process.versions?.node || 'N/A',
        chromeVersion: process.versions?.chrome || 'N/A'
      }

      systemInfo.value = info
      return info
    } catch (error) {
      console.error('Failed to get system info:', error)
      return null
    }
  }

  const showMessageBox = async (options: Electron.MessageBoxOptions) => {
    if (!window.electronAPI) return null
    return await window.electronAPI.showMessageBox(options)
  }

  const showOpenDialog = async (options: Electron.OpenDialogOptions) => {
    if (!window.electronAPI) return null
    return await window.electronAPI.showOpenDialog(options)
  }

  const showSaveDialog = async (options: Electron.SaveDialogOptions) => {
    if (!window.electronAPI) return null
    return await window.electronAPI.showSaveDialog(options)
  }

  const minimizeWindow = async () => {
    if (!window.electronAPI) return
    await window.electronAPI.minimizeWindow()
  }

  const maximizeWindow = async () => {
    if (!window.electronAPI) return
    await window.electronAPI.maximizeWindow()
  }

  const closeWindow = async () => {
    if (!window.electronAPI) return
    await window.electronAPI.closeWindow()
  }

  const isWindowMaximized = async (): Promise<boolean> => {
    if (!window.electronAPI) return false
    return await window.electronAPI.isWindowMaximized()
  }

  onMounted(() => {
    checkElectronAvailability()
    if (isElectron.value) {
      getSystemInfo()
    }
  })

  return {
    isElectron,
    systemInfo,
    getSystemInfo,
    showMessageBox,
    showOpenDialog,
    showSaveDialog,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    isWindowMaximized
  }
}
