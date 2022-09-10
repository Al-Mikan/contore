// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen, dialog,systemPreferences } from 'electron'
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
    start_date: string
  }
  setting: {
    camera: boolean
    drag: boolean
  }
  shop: {
    fish: number
  }
}

const schema: Schema<Dummy> = {
  core: {
    type: 'object',
    default: {}, // 明示的に与えないと子要素が取り出せないバグが起きる
    properties: {
      experience_point: { type: 'integer', default: 0, minimum: 0 },
      start_date: { type: 'string', default: 'default' },
      coin: { type: 'integer', default: 30, minimum: 0, maximum: 9999 },
      health_point: {
        type: 'integer',
        default: 96 * 3600,
        maximum: 96 * 3600,
        minimum: 0,
      },
      last_login: {
        type: 'string',
        format: 'date-time',
        default: getNowYMDhmsStr(),
      },
    },
    additionalProperties: false,
  },
  shop: {
    type: 'object',
    default: {}, // 明示的に与えないと子要素が取り出せないバグが起きる
    properties: {
      fish: { type: 'integer', default: 0, minimum: 0 },
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

function getNowYMDhmsStr() {
  const date = new Date()
  const Y = date.getFullYear()
  const M = ('00' + (date.getMonth() + 1)).slice(-2)
  const D = ('00' + date.getDate()).slice(-2)
  const h = ('00' + date.getHours()).slice(-2)
  const m = ('00' + date.getMinutes()).slice(-2)
  const s = ('00' + date.getSeconds()).slice(-2)

  return Y + '-' + M + '-' + D + 'T' + h + ':' + m + ':' + s
}

if (store.get('core.start_date') == 'default') {
  store.set('core.start_date', getNowYMDhmsStr())
}

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  updateHealthLastLogin()
  if (process.platform == 'darwin'){
    await systemPreferences.askForMediaAccess('camera').then((e) => {
      console.log('success media access', e)
    }).catch((e) => {
      console.log('failed media access', e)
    })
  }
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
      title: 'question',
      type: 'question',
      message: '確認しておきたいことがあります！',
      detail:
        'あなたの姿勢を検出するために、カメラをオンにしてもよろしいですか？',
      buttons: btns,
    })
  }
  ipcMain.handle('camera-confirm', async () => {
    const event = await camera_confirm()
    // Esc, ウィンドウを閉じる場合は1が戻り値 (NOのインデックスが帰ってくる)
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

const updateHealthLastLogin = () => {
  const last_login: string = store.get('core.last_login')
  if (last_login === undefined) {
    throw new Error('electron-store: core.last_loginが存在しません')
  }
  const nowHP: number = store.get('core.health_point')
  if (nowHP === undefined) {
    throw new Error('electron-store: core.health_pointが存在しません')
  }

  const date_last_login = new Date(last_login)
  const date_now = new Date()
  const blank = Math.floor(
    (date_now.getTime() - date_last_login.getTime()) / 1000
  )
  store.set('core.health_point', Math.max(nowHP - blank, 0))
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('quit', () => {
  // 同期的にログイン日時の処理
  store.set('core.last_login', getNowYMDhmsStr())
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
