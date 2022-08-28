const { SliderProvider } = require("@chakra-ui/react");
const { truncate } = require("fs");
const { waitForDebugger } = require("inspector");
const path = require("path")
const {spawn,} = require("child_process");
const readline = require('readline');

async function getScore(){


   PY_PATH = path.join(__dirname,'camera.py')

   const {stderr,stdout} = await spawn('python',['-u',PY_PATH])
   stdout.setEncoding('utf-8')

   stdout.on("data",data=>{
      console.log(data)
   })
}

function main(){
   getScore()
}

main()
// export default getScore 