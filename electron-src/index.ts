// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// electron-storeの初期化
import Store from 'electron-store'
const store = new Store()
const path = require('path')

function db_init() {
  if (!store.has('exp_point')) {
    store.set('exp_point', 0);
  }
}

db_init();

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
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

  // データベースの処理
  ipcMain.handle('read', (event: Electron.IpcMainInvokeEvent, str: string) => {
    return store.get(str)
  })
  ipcMain.handle('update', (event: Electron.IpcMainInvokeEvent, key: string, value: string) => {
    store.set(key, value)
  })
  ipcMain.handle('delete', (event: Electron.IpcMainInvokeEvent, key: string) => {
    store.delete(key)
  })
})

app.on('window-all-closed', app.quit)