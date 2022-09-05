import Layout from '../components/Layout'

const IndexPage = () => {
  const hperw = 720 / 1280

  return (
    <Layout title="Home | こんとれ！！">
      <h1 onClick={startCamera}>はろーこんとれ</h1>
      <p>
        結果:<span id="result"></span>
      </p>
      <video
        id="video"
        style={{ visibility: 'hidden', width: '0px', height: '0px' }}
      />
      <canvas
        id="canvas"
        width={1000}
        height={`${1000 * hperw}`}
        style={{
          visibility: 'hidden',
          width: '500px',
          height: `${500 * hperw}px`,
          margin: '0',
        }}
      />
    </Layout>
  )
}

async function startCamera(): Promise<void> {
  let w: number = 1280
  let h: number = 720

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: w, height: h },
    audio: false,
  })
  const video = document.getElementById('video') as HTMLVideoElement
  video.srcObject = stream
  await video.play() // カメラ起動まで待つ
  setTimeout(get_and_send, 5000)
}

async function get_and_send(): Promise<void> {
  const video = document.getElementById('video') as HTMLVideoElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  const result = document.getElementById('result') as HTMLSpanElement

  // 動画からキャンバスに画像を書き出す
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const base64 = canvas.toDataURL('image/string')
  console.log(base64.slice(30000, 30010))

  const isApplicationClosed = await cameraAPI.cansend()
  if (isApplicationClosed) {
    const res = await cameraAPI.sendcamera(base64)
    result.textContent = res
    // console.log(`index.tsx:${flag}`);
    get_and_send()
  } else {
    // console.log(`index.tsx:${flag}`)
  }
}

export default IndexPage
