/* eslint-disable prettier/prettier */
import { app, safeStorage } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

export interface SecureConfig {
  installed?: boolean
  kioskMode?: boolean
  policiesAccepted?: boolean
  installedAt?: string
  permissionsGranted?: boolean
  restrictionsDisabledForNow?: boolean
  syncPort?: number | null
  computerName?: string
  computerRoom?: string
  computerBuilding?: string
  [key: string]: unknown
}

const configPath = join(app.getPath('userData'), 'secure-config.enc')

export function saveSecureConfig(data: SecureConfig): void {
  try {
    const existingConfig = loadSecureConfig()
    const mergedConfig = {
      ...existingConfig,
      ...data,
    }
    const jsonString = JSON.stringify(mergedConfig)

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

export function eraseSecureConfig(): SecureConfig {
  try {
    fs.unlinkSync(configPath)
    } catch (error) {
    console.error('Failed to erase secure configuration:', error)
  }
  return { installed: false, policiesAccepted: false }
}