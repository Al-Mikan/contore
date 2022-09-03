import { truncate } from 'lodash'
import { VideoResource } from 'pixi.js'
import { start } from 'repl'
import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'
import dataUriToBuffer from 'data-uri-to-buffer'
import { Stream } from 'stream'
import { get } from 'https'

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
    setTimeout(get_and_send, 5000);
  })

  const sendcamera:(content:String)=>Promise<void> = (window as any).banana.sendcamera

  async function get_and_send():Promise<void>{
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    let base64 = await canvas.toDataURL('image/string');
    console.log("index.tsx:now calling sendcamera.....");
    await sendcamera(base64);
    console.log('index.tsx:now catched sendcamera return');
    setTimeout(get_and_send, 50);
  }




}


export default IndexPage
