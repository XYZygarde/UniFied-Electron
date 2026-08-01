/// <reference types="vite/client" />

declare global {
  interface Window {
    api: {
      send: (channel: string, data?: unknown) => void
      invoke: (channel: string, data?: unknown) => Promise<unknown>
    }
    electron: unknown
  }
}

export {}
