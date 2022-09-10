// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen, dialog } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// electron-storeの初期化
import Store, { Schema } from 'electron-store'

/* トップレベルでJsonSchamaを置くことは仕様上無理 */
interface Dummy {
  core: {
    experience_point: number
    coin: number
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

  const btns = ['OK', 'NO']
  //mainwindowと同じスコープがいい
  const camera_confirm = () => {
    return dialog.showMessageBox(mainWindow, {
      title: 'alert',
      message: '確認しておきたいことがあります！',
      detail:
        'あなたの姿勢を検出するために、カメラをオンにしてもよろしいですか？',
      buttons: btns,
    })
  }
  ipcMain.handle('camera_confirm', async () => {
    const event = await camera_confirm()
    return btns[event.response] === 'OK'
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
