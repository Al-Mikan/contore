// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, screen } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import Score from './Score'

// electron-storeの初期化
import Store from 'electron-store'
const store = new Store()

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
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

app.whenReady().then(
  ()=>{
    console.log('now recieved call of sendcamera')
    ipcMain.on("send-camera",(_,content:String)=>{
    // console.log(content.length)
    console.log("index.ts:now calling Score.ts....")
    Score(content)
    // console.log(`from main:${ans}`)
    })
  }
)

// レンダラープロセスはメインプロセスにプロセス間通信でデータ取得を要求する
ipcMain.handle('getStoreValue', (_, key) => {
  return store.get(key)
})
