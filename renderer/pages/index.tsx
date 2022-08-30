import { truncate } from 'lodash'
import { VideoResource } from 'pixi.js'
import { start } from 'repl'
import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'
import dataUriToBuffer from 'data-uri-to-buffer'
import { Stream } from 'stream'

const hperw = 720/1280

const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <h1 onClick={startCamera}>はろーこんとれ</h1>
      <video id="video" style={{visibility:"hidden",width:'0px',height:'0px'}} />
      <canvas id="canvas" width={1000} height={`${1000 * hperw}`} style={{width:'500px',height:`${500 * hperw}px`,margin:'0'}}/>
    </Layout>
  )
}


async function startCamera():Promise<void>{
  let w:number = 1280
  let h:number = 720
  
  const video = document.getElementById("video") as HTMLVideoElement;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  
  await navigator.mediaDevices.getUserMedia({video:{width:w,height:h},audio:false}).then(stream=>{
    video.srcObject = stream ;
    video.play();
  })

  const sendcamera = (window as any).banana.sendcamera
  let flag:Boolean = false
  setInterval(()=>{
    
    ctx.drawImage(video,0,0,canvas.width,canvas.height)
    let base64 = canvas.toDataURL('image/string')
    // .replace(/^.*,/, '');
    // console.log(base64)
    if (!flag){
      sendcamera(base64)
      console.log(base64)
      flag = true
    }
  },10000/50)


}


export default IndexPage
