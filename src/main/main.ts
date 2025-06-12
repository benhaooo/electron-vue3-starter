import { app, BrowserWindow, ipcMain, shell, dialog, Menu } from 'electron'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import { createMenu } from './menu'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// This is only needed for production builds with Squirrel installer
// if (require('electron-squirrel-startup')) {
//   app.quit()
// }

class ElectronApp {
  private mainWindow: BrowserWindow | null = null
  private isDev = !app.isPackaged

  constructor() {
    this.init()
  }

  private init(): void {
    // This method will be called when Electron has finished initialization
    app.whenReady().then(() => {
      this.createWindow()
      this.setupMenu()
      this.setupIPC()

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    // Quit when all windows are closed, except on macOS
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // Security: Prevent new window creation
    app.on('web-contents-created', (_, contents) => {
      contents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
      })
    })
  }

  private createWindow(): void {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true, // 隐藏菜单栏，按 Alt 键显示
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '../preload/preload.cjs'),
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    })

    // Load the app
    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:5173')
      // Open DevTools in development
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  private setupMenu(): void {
    createMenu()
  }

  private setupIPC(): void {
    // Example IPC handlers
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
        chrome: process.versions.chrome
      }
    })

    ipcMain.handle('dialog:showMessageBox', async (_, options) => {
      if (!this.mainWindow) return
      const result = await dialog.showMessageBox(this.mainWindow, options)
      return result
    })

    ipcMain.handle('dialog:showOpenDialog', async (_, options) => {
      if (!this.mainWindow) return
      const result = await dialog.showOpenDialog(this.mainWindow, options)
      return result
    })

    ipcMain.handle('dialog:showSaveDialog', async (_, options) => {
      if (!this.mainWindow) return
      const result = await dialog.showSaveDialog(this.mainWindow, options)
      return result
    })

    // Window controls
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize()
    })

    ipcMain.handle('window:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow?.maximize()
      }
    })

    ipcMain.handle('window:close', () => {
      this.mainWindow?.close()
    })

    ipcMain.handle('window:isMaximized', () => {
      return this.mainWindow?.isMaximized() ?? false
    })

    // 文件操作
    ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
      try {
        await writeFile(filePath, content, 'utf8')
        return { success: true }
      } catch (error) {
        console.error('Failed to write file:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    })

    // 打开外部链接
    ipcMain.handle('shell:openExternal', async (_, url: string) => {
      try {
        await shell.openExternal(url)
        return { success: true }
      } catch (error) {
        console.error('Failed to open external URL:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    })
  }
}

// Create the application instance
new ElectronApp()
