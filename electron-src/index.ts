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

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    resizable: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })
  // レンダリングが終了してから表示する
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const display = screen.getPrimaryDisplay()
  mainWindow.setSize(display.workAreaSize.width, display.workAreaSize.height)
  mainWindow.center()

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

ipcMain.handle(
  'set-ignore-mouse-events',
  (event, flag: boolean, options?: { forward: boolean }) => {
    BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(
      flag,
      options
    )
  }
)

ipcMain.handle('set-always-on-top', (event, flag: boolean) => {
  BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(flag)
})

ipcMain.handle('close-window', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close()
})
