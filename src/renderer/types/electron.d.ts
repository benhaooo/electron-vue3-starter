// Type definitions for Electron API exposed through preload script

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

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
