/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer, IpcRenderer } from 'electron'

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }
}

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer
})

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (flag: boolean, options?: { forward: boolean }) =>
    ipcRenderer.invoke('set-ignore-mouse-events', flag, options),
  setAlwaysOnTop: (flag: boolean) =>
    ipcRenderer.invoke('set-always-on-top', flag),
  closeWindow: () => ipcRenderer.invoke('close-window'),
})
