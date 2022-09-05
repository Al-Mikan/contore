import path from 'path'
import { spawnSync, SpawnSyncReturns } from 'child_process'

const Score = (imageBase64: string) => {
  const scriptPath = path.join(__dirname, 'camera.py')

  let result: SpawnSyncReturns<string>
  // OSごとにコマンドが異なる
  if (process.platform === 'win32') {
    // Windows
    result = spawnSync('cmd', ['/c', 'python', scriptPath], {
      input: imageBase64,
      encoding: 'utf-8', // NOTE: 文字化けする可能性大
    })
  } else {
    // Mac or Linux
    result = spawnSync('python', [scriptPath], {
      input: imageBase64,
      encoding: 'utf-8',
    })
  }

  // 子プロセスの実行が失敗
  if (result.error) {
    throw result.error
  }

  // pythonが出力したエラー
  if (result.stderr) {
    throw new Error(result.stderr)
  }

  return result.stdout
}

export default Score
