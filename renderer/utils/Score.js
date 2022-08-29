import path from 'path';
import {spawn }from 'child_process';

let li = [];

const Score = () => {
   const PY_PATH = path.join(__dirname,'camera.py');
   const {stderr,stdout} = spawn('python',['-u',PY_PATH]);
   stdout.setEncoding('utf-8');

   stdout.on("data",(data)=>{
      console.log(data);
   })
}
export default Score