/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/UF_icon.png?asset'

// Import the newly separated configuration manager
import { saveSecureConfig, loadSecureConfig, eraseSecureConfig } from './configManager'

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
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

  ipcMain.handle('run-system-checks', async () => {
    const logs: { message: string; level: 'info' | 'warn' | 'error' }[] = []
    try {
      logs.push({ message: `Starting system checks at ${new Date().toLocaleString()}`, level: 'info' })
      logs.push({ message: `Platform: ${process.platform} ${process.arch}`, level: 'info' })
      logs.push({ message: `Node: ${process.version}`, level: 'info' })
      logs.push({ message: `Electron: ${process.versions.electron ?? 'n/a'}`, level: 'info' })

      // CPU and memory
      const cpus = os.cpus()?.length ?? 0
      logs.push({ message: `CPU cores: ${cpus}`, level: 'info' })
      const totalMemMb = Math.round((os.totalmem() / 1024 / 1024))
      const freeMemMb = Math.round((os.freemem() / 1024 / 1024))
      logs.push({ message: `Memory: ${freeMemMb} MB free / ${totalMemMb} MB total`, level: 'info' })

      // Required modules
      const required = ['electron-store', 'express', 'lokijs']
      for (const dep of required) {
        try {
          require.resolve(dep)
          logs.push({ message: `Dependency found: ${dep}`, level: 'info' })
        } catch (err: any) {
          logs.push({ message: `Dependency missing: ${dep}`, level: 'warn' })
        }
      }

      // Writable userData test
      const testPath = join(app.getPath('userData'), 'unified-write-test.tmp')
      try {
        fs.writeFileSync(testPath, 'ok')
        fs.unlinkSync(testPath)
        logs.push({ message: 'Writable userData folder: OK', level: 'info' })
      } catch (err) {
        logs.push({ message: `Writable userData folder: FAILED (${String(err)})`, level: 'error' })
      }

      logs.push({ message: 'System checks complete', level: 'info' })
    } catch (err) {
      logs.push({ message: `System checks error: ${String(err)}`, level: 'error' })
    }

    return logs
  })

  ipcMain.handle('erase-config', () => {
    eraseSecureConfig()
    if (mainWindow) {
      console.log('Erased secure config')
    }
    return true
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