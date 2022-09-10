import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils/drawing_utils'
import { Camera } from '@mediapipe/camera_utils/camera_utils'
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose/pose'
import { threadId } from 'worker_threads'

export default class Camera_handle {
  private count_cat: Number = 0
  private count_all: Number = 0
  private videoElement = document.getElementById('video') as HTMLVideoElement
  private canvasElement = document.getElementById('canvas') as HTMLCanvasElement
  private canvasCtx: any
  private camera: any
  private pose: any
  private keys: Array<string>
  private is_cat_counter: number = 0
  private detect_counter: number = 0
  private results: any
  public cat_detect_ratio: number
  public score: number = 0
  public poses: Object = {
    NOSE: [-1, -1],
    L_SHOULDER: [-1, -1],
    R_SHOULDER: [-1, -1],
  }

  constructor() {
    this.onResults = this.onResults.bind(this)
    this.start_camera = this.start_camera.bind(this)
    this.stop_camera = this.stop_camera.bind(this)

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
    // console.log(res);
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

    //   this.canvasCtx.save();
    //   this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    //   this.canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //                       this.canvasElement.width, this.canvasElement.height);

    //   // Only overwrite existing pixels.
    //   this.canvasCtx.globalCompositeOperation = 'source-in';
    //   this.canvasCtx.fillStyle = '#00FF00';
    //   this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    //   // Only overwrite missing pixels.
    //   this.canvasCtx.globalCompositeOperation = 'destination-atop';
    //   this.canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //     this.canvasElement.width, this.canvasElement.height);
    //   this.canvasCtx.drawImage(
    //       results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

    //   this.canvasCtx.globalCompositeOperation = 'source-over';
    //   drawConnectors(this.canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
    //                  {color: '#00FF00', lineWidth: 4});
    //   drawLandmarks(this.canvasCtx, results.poseLandmarks,
    //                 {color: '#FF0000', lineWidth: 2});
    //   this.canvasCtx.restore();

    //   console.log(results.poseWorldLandmarks);
    //   console.log(results.poseLandmarks);

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
    // this.canvasCtx.fillText(message_cat,600,30);
    //   this.canvasCtx.fillText(`x:${this.poses["NOSE"][0]},y:${this.poses["NOSE"][1]}`,this.poses["NOSE"][0],this.poses["NOSE"][1]);
    //   this.canvasCtx.fillText(`x:${this.poses["L_SHOULDER"][0]},y:${this.poses["L_SHOULDER"][1]}`,this.poses["L_SHOULDER"][0],this.poses["L_SHOULDER"][1]);
    //   this.canvasCtx.fillText(`x:${this.poses["R_SHOULDER"][0]},y:${this.poses["R_SHOULDER"][1]}`,this.poses["R_SHOULDER"][0],this.poses["R_SHOULDER"][1]);
    // console.log(this.poses);

    this.detect_counter += 1
  }

  start_camera() {
    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await this.pose.send({ image: this.videoElement })
      },
      width: 1280,
      height: 720,
    })
    this.camera.start()
  }

  stop_camera() {
    if (this.detect_counter !== 0) {
      this.cat_detect_ratio =
        (1 - this.is_cat_counter / this.detect_counter) * 100
    }
    this.camera.stop()
  }
}
