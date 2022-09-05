/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, IpcRenderer, contextBridge} from 'electron'

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
  global.ipcRenderer = ipcRenderer;
  contextBridge.exposeInMainWorld('banana',{
    sendcamera:async function(content:string){return await ipcRenderer.invoke('send-camera',content)},
    cansend:()=>{return ipcRenderer.invoke('check')},
    })}
)
