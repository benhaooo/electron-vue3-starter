import { Titlebar, TitlebarColor } from 'custom-electron-titlebar'
import { contextBridge, ipcRenderer } from 'electron'

// Define the API interface
export interface ElectronAPI {
  // App methods
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getVersions: () => Promise<{ node: string, electron: string, chrome: string }>

  // Dialog methods
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  showOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>

  // Window controls
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  isWindowMaximized: () => Promise<boolean>

  // Theme management
  updateTheme: (theme: string) => Promise<void>

  // Window state listeners
  onWindowMaximized: (callback: (isMaximized: boolean) => void) => void
  onWindowFocus: (callback: (isFocused: boolean) => void) => void

  // File operations
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean, error?: string }>

  // Shell operations
  openExternal: (url: string) => Promise<{ success: boolean, error?: string }>

  // Event listeners
  onShowAbout: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // App methods
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getVersions: () => ipcRenderer.invoke('app:getVersions'),

  // Dialog methods
  showMessageBox: options => ipcRenderer.invoke('dialog:showMessageBox', options),
  showOpenDialog: options => ipcRenderer.invoke('dialog:showOpenDialog', options),
  showSaveDialog: options => ipcRenderer.invoke('dialog:showSaveDialog', options),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // Theme management
  updateTheme: (theme: string) => ipcRenderer.invoke('theme:update', theme),

  // Window state listeners
  onWindowMaximized: (callback: (isMaximized: boolean) => void) => {
    ipcRenderer.on('window:maximized', (_, isMaximized) => callback(isMaximized))
  },
  onWindowFocus: (callback: (isFocused: boolean) => void) => {
    ipcRenderer.on('window:focus', (_, isFocused) => callback(isFocused))
  },

  // File operations
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),

  // Shell operations
  openExternal: url => ipcRenderer.invoke('shell:openExternal', url),

  // Event listeners
  onShowAbout: (callback) => {
    ipcRenderer.on('show-about', callback)
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
}

window.addEventListener('DOMContentLoaded', () => {
  // 初始化时根据document的类来判断当前主题
  const isDarkTheme = document.documentElement.classList.contains('dark')

  // 创建带有主题颜色的Titlebar
  const titlebar = new Titlebar({
    backgroundColor: isDarkTheme
      ? TitlebarColor.fromHex('#1f2937')
      : TitlebarColor.fromHex('#ffffff'),
    unfocusEffect: true,
  })

  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes'
        && mutation.attributeName === 'class'
      ) {
        const isDark = document.documentElement.classList.contains('dark')
        // 根据当前主题更新titlebar背景色
        if (isDark) {
          titlebar.updateBackground(TitlebarColor.fromHex('#1f2937'))
        }
        else {
          titlebar.updateBackground(TitlebarColor.fromHex('#ffffff'))
        }
      }
    })
  })

  // 观察html元素的class变化，因为主题是通过添加/移除dark类来实现的
  observer.observe(document.documentElement, { attributes: true })
})

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declaration for global window object
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
