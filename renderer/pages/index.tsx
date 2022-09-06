import { truncate } from 'lodash'
import { VideoResource } from 'pixi.js'
import { start } from 'repl'
import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'
import dataUriToBuffer from 'data-uri-to-buffer'
import { Stream } from 'stream'
import { get } from 'https'
import { app } from 'electron'
import { ipcRenderer } from 'electron/renderer'

const hperw = 720/1280

const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <h1 onClick={startCamera}>はろーこんとれ</h1>
      <p>結果:<span id='result'></span></p>
      <video id="video" style={{visibility:"hidden",width:'0px',height:'0px'}} />
      <canvas id="canvas" width={1000} height={`${1000 * hperw}`} style={{visibility:'hidden',width:'500px',height:`${500 * hperw}px`,margin:'0'}}/>
    </Layout>
  )
}


async function startCamera():Promise<void>{
  let w:number = 1280
  let h:number = 720
  
  
  await navigator.mediaDevices.getUserMedia({video:{width:w,height:h},audio:false}).then(stream=>{
  const video = document.getElementById("video") as HTMLVideoElement;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const result = document.getElementById('result') as HTMLSpanElement

    video.srcObject = stream ;
    video.play();
    setTimeout(get_and_send, 5000);
  })

}



async function get_and_send():Promise<void>{
  const sendcamera:(content:string)=>Promise<string> = (window as any).banana.sendcamera
  const video = document.getElementById("video") as HTMLVideoElement;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const result = document.getElementById('result') as HTMLSpanElement;

  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  let base64 = canvas.toDataURL('image/string');
  console.log(base64.slice(30000,30010))
  const res = await sendcamera(base64);
  result.textContent = res;
  
  
  const flag = await (window as any).banana.cansend();
  if (flag) {
    get_and_send();
    // console.log(`index.tsx:${flag}`);
  }else{
    // console.log(`index.tsx:${flag}`)
  }
  }





export default IndexPage
