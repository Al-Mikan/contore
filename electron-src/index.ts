// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// electron-storeの初期化
import Store from 'electron-store'
const store = new Store()


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
  const {screen}  = require('electron')
  const display = screen.getPrimaryDisplay()
  const w = display.size.width

  
  mainWindow.setAspectRatio(16/9)
  mainWindow.setSize(w/2,w/2 / 16 * 9)
  mainWindow.center()
  mainWindow.setMinimumSize(w/4,w/4 / 16 * 9)
  
  const url = isDev
  ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(url)
})

app.on('window-all-closed', app.quit)

// レンダラープロセスはメインプロセスにプロセス間通信でデータ取得を要求する
ipcMain.handle('getStoreValue', (_, key) => {
  return store.get(key)
})
