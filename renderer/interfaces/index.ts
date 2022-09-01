// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpcRenderer } from 'electron'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
    }
  }

  var database: {
    read: (str: string) => Promise<number>
    update: (key: string, value: string) => Promise<void>
    delete: (key: string) => Promise<void>
  }

  var electronAPI: {
    setIgnoreMouseEvents: (
      flag: boolean,
      options?: { forward: boolean }
    ) => Promise<void>
    setAlwaysOnTop: (flag: boolean) => Promise<void>
    closeWindow: () => Promise<void>
  }
}
