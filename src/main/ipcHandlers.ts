import { ipcMain, app, dialog, shell, BrowserWindow } from 'electron'
import { writeFile } from 'fs/promises'

/**
 * Setup all IPC handlers for the main process
 */
export function setupIpcHandlers(mainWindow: BrowserWindow | null) {
  // App information handlers
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })

  ipcMain.handle('app:getPlatform', () => {
    return process.platform
  })

  ipcMain.handle('app:getVersions', () => {
    return {
      node: process.versions.node,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
    }
  })

  // Dialog handlers
  ipcMain.handle('dialog:showMessageBox', async (_, options) => {
    if (!mainWindow) return
    const result = await dialog.showMessageBox(mainWindow, options)
    return result
  })

  ipcMain.handle('dialog:showOpenDialog', async (_, options) => {
    if (!mainWindow) return
    const result = await dialog.showOpenDialog(mainWindow, options)
    return result
  })

  ipcMain.handle('dialog:showSaveDialog', async (_, options) => {
    if (!mainWindow) return
    const result = await dialog.showSaveDialog(mainWindow, options)
    return result
  })

  // Window control handlers
  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle('window:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow?.isMaximized() ?? false
  })

  // File system handlers
  ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
    try {
      await writeFile(filePath, content, 'utf8')
      return { success: true }
    } catch (error) {
      console.error('Failed to write file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Shell handlers
  ipcMain.handle('shell:openExternal', async (_, url: string) => {
    try {
      await shell.openExternal(url)
      return { success: true }
    } catch (error) {
      console.error('Failed to open external URL:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}

/**
 * Remove all IPC handlers
 */
export function removeIpcHandlers() {
  const handlers = [
    'app:getVersion',
    'app:getPlatform',
    'app:getVersions',
    'dialog:showMessageBox',
    'dialog:showOpenDialog',
    'dialog:showSaveDialog',
    'window:minimize',
    'window:maximize',
    'window:close',
    'window:isMaximized',
    'fs:writeFile',
    'shell:openExternal',
  ]

  handlers.forEach(handler => {
    ipcMain.removeAllListeners(handler)
  })
}
