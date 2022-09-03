const path = require('path')
const {spawnSync} = require('child_process')

const Score = (content:String) => {
    console.log("Score.ts:now called Score.ts")
    const PY_PATH = path.join(__dirname,'camera.py');
    console.log("score.ts:now calling camera.py")
    let data  = spawnSync('python',[PY_PATH],{input:content,encoding:'utf-8'});
    console.log(data.stdout);
    // console.log(data.stderr);
}


export default Score
