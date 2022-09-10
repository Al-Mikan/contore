import { Camera } from '@mediapipe/camera_utils/camera_utils'
import { Pose } from '@mediapipe/pose/pose'

export default class Camera_handle {
  private count_cat: number = 0
  private count_all: number = 0
  private videoElement = document.getElementById('video') as HTMLVideoElement
  private canvasElement = document.getElementById('canvas') as HTMLCanvasElement
  private canvasCtx: CanvasRenderingContext2D
  private camera: Camera
  private pose: Pose
  private keys: Array<string>
  private is_cat_counter: number = 0
  private detect_counter: number = 0
  private results: any
  private setIsLoading: any
  public cat_detect_ratio: number
  public score: number = 0
  public poses: Object = {
    NOSE: [-1, -1],
    L_SHOULDER: [-1, -1],
    R_SHOULDER: [-1, -1],
  }

  constructor(setIsLoading) {
    this.onResults = this.onResults.bind(this)
    this.start_camera = this.start_camera.bind(this)
    this.stop_camera = this.stop_camera.bind(this)
    this.setIsLoading = setIsLoading

    if (!this.videoElement)
      this.videoElement = document.getElementById('video') as HTMLVideoElement
    if (!this.canvasElement)
      this.canvasElement = document.getElementById(
        'canvas'
      ) as HTMLCanvasElement
    this.canvasCtx = this.canvasElement.getContext('2d')
    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      },
    })
    this.keys = Object.keys(this.poses)
    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
    this.pose.onResults(this.onResults)
  }

  private Judge(poses: Object) {
    const times = 10
    const buf = 30
    //----------------------------

    const res = { is_cat: false }

    const nose = poses['NOSE']
    const l_shoulder = poses['L_SHOULDER']
    const r_shoulder = poses['R_SHOULDER']

    const d = Math.abs(l_shoulder[0] - r_shoulder[0])
    const mid_y = (l_shoulder[1] + r_shoulder[1]) / 2 - buf

    if (Math.abs(nose[1] - mid_y) * times < d) {
      res['is_cat'] = true
    }
    return res
  }

  private onResults(results) {
    this.results = results
    if (!results) {
      return
    }

    if (!results.segmentationMask) {
      console.log('could not detect your body')
      return
    }

    const landmark_dic = { NOSE: 0, L_SHOULDER: 11, R_SHOULDER: 12 }
    this.keys.forEach((point) => {
      const n = landmark_dic[point]
      const { x, y } = results.poseLandmarks[n]
      this.poses[point] = [x * 1280, y * 720]
    })

    const judged = this.Judge(this.poses)
    let message_cat: string
    if (judged['is_cat']) {
      message_cat = 'Are you a cat?'
      this.is_cat_counter += 1
    } else {
      message_cat = 'Good Pose!'
    }

    this.detect_counter += 1
  }

  async start_camera() {
    this.camera = await new Camera(this.videoElement, {
      onFrame: async () => {
        await this.pose.send({ image: this.videoElement })
        console.log('onFrame!!')
        this.setIsLoading(false)
      },
      width: 1280,
      height: 720,
    })
    console.log('will camera.start()')
    await this.camera.start()
    console.log('did camera.start()')
    return
  }

  stop_camera() {
    if (this.detect_counter !== 0) {
      this.cat_detect_ratio =
        (1 - this.is_cat_counter / this.detect_counter) * 100
    }
    this.camera.stop()
  }
}
