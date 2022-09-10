// preload.tsでロードされるオブジェクトの型定義
import { IpcRenderer } from 'electron'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }

  var database: {
    read: (str: string) => Promise<any | undefined>
    update: (key: string, value: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }

  var electronAPI: {
    camera_confirm: () => Promise<Boolean>
    setIgnoreMouseEvents: (
      flag: boolean,
      options?: { forward: boolean }
    ) => Promise<void>
    setAlwaysOnTop: (flag: boolean) => Promise<void>
    closeWindow: () => Promise<void>
  }
}
