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
  getDisplaySize: () => ipcRenderer.invoke('getDisplaySize'),
  setIgnoreMouseEvents: (flag: boolean, options?: { forward: boolean }) =>
    ipcRenderer.invoke('set-ignore-mouse-events', flag, options),
  setAlwaysOnTop: (flag: boolean) =>
    ipcRenderer.invoke('set-always-on-top', flag),
  setWindowRightBottom: () => ipcRenderer.invoke('set-window-right-bottom'),
  setWindowCenter: () => ipcRenderer.invoke('set-window-center'),
})
