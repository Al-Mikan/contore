import path from 'path';
import {spawn }from 'child_process';
// import {writeFile} from 'fs'
// import {Buffer} from 'buffer'

const Score = (content:String) => {
   console.log("Score!")
   console.log('---------------')
   console.log(content.length)
   console.log('---------------')
   const PY_PATH = path.join(__dirname,'camera.py');
   let {stdout,stdin,stderr} = spawn('python',['-u',PY_PATH],{timeout:4});


   // const content_with_end = content + '\\n'
   // console.log(content_with_end.slice(content_with_end.length-3))
   // stdin.write(content_with_end)
   stdin.write(content)
   stdin.write('\n')
   stdout.setEncoding('utf-8');
   stderr.setEncoding('utf-8');

   stdout.on("data",data=>{
      // console.log('done!')
      // return data 
      console.log(data)
   })

   stderr.on("data",data=>{
      console.log(data)
   })
}


// const Score = (content:String) =>{
//     const data = new Uint8Array(Buffer.from(content))
//     writeFile("out.txt",data,()=>{
//         console.log("done!")
//     })
// }

export default Score
