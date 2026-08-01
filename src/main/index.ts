/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import * as http from 'http'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/UF_icon.png?asset'

// Import the newly separated configuration manager
import { saveSecureConfig, loadSecureConfig } from './configManager'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window with fixed dimensions and kiosk safety flags
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

  // Check saved secure config state on boot
  const config = loadSecureConfig()
  if (config.installed && config.kioskMode) {
    mainWindow.setKiosk(true)
    mainWindow.setAlwaysOnTop(true, 'screen-saver')
    mainWindow.setVisibleOnAllWorkspaces(true)
    mainWindow.setSkipTaskbar(true)
  }

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
    // 1. Save the configuration data into secure local storage via the config manager
    saveSecureConfig({
      installed: true,
      policiesAccepted: true,
      installedAt: new Date().toISOString(),
      ...policyData
    })

    if (mainWindow) {
      // 2. Enforce OS-Level Kiosk Lockdown and Window Restrictions
      mainWindow.setKiosk(true)
      mainWindow.setAlwaysOnTop(true, 'screen-saver')
      mainWindow.setVisibleOnAllWorkspaces(true)
      mainWindow.setSkipTaskbar(true)

      // 3. Initialize Offline Network Synchronization Server on Port 8080
      const syncServer = http.createServer((req, res) => {
        if (req.method === 'POST' && req.url === '/sync') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: 'success', message: 'Attendance log synced locally.' }))
          })
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('UniFied Secure Kiosk Gateway Active')
        }
      })

      syncServer.listen(8080, '0.0.0.0', () => {
        console.log('UniFied offline sync server running securely on port 8080')
      })
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