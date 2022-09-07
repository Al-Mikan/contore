// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// electron-storeの初期化
import Store, { Schema } from 'electron-store'

/* トップレベルでJsonSchamaを置くことは仕様上無理 */
interface Dummy {
  core: {
    experience_point: number
    coin: number
    health_point: number
    last_login: string
  }
  setting: {
    camera: boolean
    drag: boolean
  }
}

const schema: Schema<Dummy> = {
  core: {
    type: 'object',
    default: {}, // 明示的に与えないと子要素が取り出せないバグが起きる
    properties: {
      experience_point: { type: 'integer', default: 0, minimum: 0 },
      coin: { type: 'integer', default: 0, minimum: 0, maximum: 9999 },
      health_point: { type: 'integer', default: 96 * 3600, maximum : 96 * 3600, minimum : 0},
      last_login: { type: 'string', format: 'date-time' }
    },
    additionalProperties: false,
  },
  setting: {
    type: 'object',
    default: {}, // 明示的に与えないと子要素が取り出せないバグが起きる
    properties: {
      camera: { type: 'boolean', default: true },
      drag: { type: 'boolean', default: true },
    },
    additionalProperties: false,
  },
}

const store = new Store<Dummy>({ schema })
function getNowYMDhmsStr(){
  const date = new Date()
  const Y = date.getFullYear()
  const M = ("00" + (date.getMonth()+1)).slice(-2)
  const D = ("00" + date.getDate()).slice(-2)
  const h = ("00" + date.getHours()).slice(-2)
  const m = ("00" + date.getMinutes()).slice(-2)
  const s = ("00" + date.getSeconds()).slice(-2)

  return Y + '-' +  M + '-' + D + 'T' + h + ':' + m + ':' + s
}
if (!store.has('start_date')) {
  store.set('start_date', getNowYMDhmsStr())
}

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

app.on('window-all-closed', () => {
  // 同期的にログイン日時の処理
  store.set('core.last_login', getNowYMDhmsStr())
  app.quit()
})

// データベースの処理関数
// TODO: 例外処理
ipcMain.handle('read', (_: Electron.IpcMainInvokeEvent, str: string) => {
  return store.get(str)
})

ipcMain.handle(
  'update',
  (_: Electron.IpcMainInvokeEvent, key: string, value: any) => {
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
