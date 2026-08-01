/* eslint-disable prettier/prettier */
import { app, safeStorage } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

export interface SecureConfig {
  installed?: boolean
  kioskMode?: boolean
  policiesAccepted?: boolean
  installedAt?: string
  [key: string]: unknown
}

const configPath = join(app.getPath('userData'), 'secure-config.enc')

export function saveSecureConfig(data: SecureConfig): void {
  try {
    const jsonString = JSON.stringify(data)
    if (safeStorage.isEncryptionAvailable()) {
      const encryptedBuffer = safeStorage.encryptString(jsonString)
      fs.writeFileSync(configPath, encryptedBuffer)
    } else {
      fs.writeFileSync(configPath, jsonString)
    }
  } catch (error) {
    console.error('Failed to save secure configuration:', error)
  }
}

export function loadSecureConfig(): SecureConfig {
  try {
    if (fs.existsSync(configPath)) {
      const fileBuffer = fs.readFileSync(configPath)
      const parsedConfig = safeStorage.isEncryptionAvailable()
        ? JSON.parse(safeStorage.decryptString(fileBuffer))
        : JSON.parse(fileBuffer.toString())
      return parsedConfig as SecureConfig
    }
  } catch (error) {
    console.error('Failed to load secure configuration:', error)
  }
  return { installed: false, policiesAccepted: false }
}