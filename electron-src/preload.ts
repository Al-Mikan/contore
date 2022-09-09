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

// データベースの処理用関数
contextBridge.exposeInMainWorld('database', {
  read: (str: string) => ipcRenderer.invoke('read', str),
  update: (key: string, value: any) => ipcRenderer.invoke('update', key, value),
  delete: (key: string) => ipcRenderer.invoke('delete', key),
})

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
  camera_confirm:async ()=>{
    const ans:Promise<Boolean> =  await ipcRenderer.invoke('camera_confirm');
    return ans;
  }
})
