import path from 'path'
import { spawnSync, SpawnSyncReturns } from 'child_process'

const Score = (imageBase64: string) => {
  const scriptPath = path.join(__dirname, 'dist/camera')

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
    result = spawnSync(scriptPath,{
     input:imageBase64,
     encoding: 'utf-8',
    })
    // result = spawnSync('python', [scriptPath], {
    //   input: imageBase64,
    //   encoding: 'utf-8',
    // })
  }
  console.log(result.stderr)

  // 子プロセスの実行が失敗
  if (result.error) {
    throw result.error
  }

  // pythonが出力したエラー
  if (result.status !== 0) {
    throw new Error(result.stderr)
  }

  return result.stdout
}

export default Score
