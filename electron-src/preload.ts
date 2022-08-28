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

// データベースの処理
contextBridge.exposeInMainWorld('db', {
  read: (str: string) => ipcRenderer.invoke('read', str),
  update: (key: string, value: string) => ipcRenderer.invoke('update', key, value),
  delete: (key: string) => ipcRenderer.invoke('delete', key)
})

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer
})
