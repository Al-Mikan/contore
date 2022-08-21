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
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })
  const display = screen.getPrimaryDisplay()
  const w = display.size.width

  const apr = 16 / 9
  mainWindow.setAspectRatio(apr)
  mainWindow.setSize(Math.floor(w / 2), Math.floor(w / 2 / apr))
  mainWindow.center()
  mainWindow.setMinimumSize(Math.floor(w / 4), Math.floor(w / 4 / apr))

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

ipcMain.handle('getDisplaySize', (_) => {
  const display = screen.getPrimaryDisplay()
  return display.size
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

ipcMain.handle('set-window-right-bottom', (event) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender)
  if (mainWindow === null) return
  const display = screen.getPrimaryDisplay()
  const apr = 16 / 9
  const w = Math.floor(display.size.width / 3)
  const h = Math.floor(w / apr)
  mainWindow.setAspectRatio(apr)
  mainWindow.setSize(w, h)
  /* タスクバーのサイズを考慮するためにworkAreaSizeを使用 */
  mainWindow.setPosition(
    display.workAreaSize.width - w,
    display.workAreaSize.height - h
  )
})

ipcMain.handle('set-window-center', (event) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender)
  if (mainWindow === null) return
  const display = screen.getPrimaryDisplay()
  const apr = 16 / 9
  const w = Math.floor(display.size.width / 2)
  const h = Math.floor(w / apr)
  mainWindow.setAspectRatio(apr)
  mainWindow.setSize(w, h)
  mainWindow.center()
})
