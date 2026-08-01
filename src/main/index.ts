/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/UF_icon.png?asset'

// Import the newly separated configuration manager
import { saveSecureConfig, loadSecureConfig } from './configManager'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window with standard desktop behavior for now
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC listener triggered when the user finishes the installation flow
  ipcMain.on('apply-policies', (_event, policyData: Record<string, unknown>) => {
    // Save the configuration data into secure local storage via the config manager
    saveSecureConfig({
      installed: true,
      policiesAccepted: true,
      installedAt: new Date().toISOString(),
      ...policyData
    })

    if (mainWindow) {
      console.log('Skipping kiosk lock and sync server for now.')
    }
  })

  // IPC handler to send the saved state data directly to the React Dashboard
  ipcMain.handle('get-secure-config', () => {
    return loadSecureConfig()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})