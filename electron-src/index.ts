// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// electron-storeの初期化
import Store, { Schema } from 'electron-store'

interface Dummy {
  experience_point: number
}

const schema: Schema<Dummy> = {
  experience_point: {
    type: 'number',
    default: 0,
  },
}

const store = new Store<Dummy>({ schema })

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })
  const display = screen.getPrimaryDisplay()
  const w = display.size.width

  const apr = 16 / 9
  mainWindow.setAspectRatio(apr)
  mainWindow.setSize(w / 2, w / 2 / apr)
  mainWindow.center()
  mainWindow.setMinimumSize(w / 4, w / 4 / apr)

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(url)

  // データベースの処理関数
  ipcMain.handle('read', (_: Electron.IpcMainInvokeEvent, str: string) => {
    return store.get(str)
  })
  ipcMain.handle(
    'update',
    (_: Electron.IpcMainInvokeEvent, key: string, value: string) => {
      store.set(key, value)
    }
  )
  ipcMain.handle('delete', (_: Electron.IpcMainInvokeEvent, key: string) => {
    if (!store.has(key)) {
      return
    } else {
      store.delete(key as any)
    }
  })
})

app.on('window-all-closed', app.quit)
