const path = require('path')
const {spawnSync} = require('child_process')

const Score:(content:string)=>string = (content:string) => {
    let content_with_EOL = content + '\n';
    // console.log(content.slice(30000,30010))

    // console.log("Score.ts:now called Score.ts")
    const PY_PATH = path.join(__dirname,'camera.py');
    // console.log("score.ts:now calling camera.py")
    let data  = spawnSync('python',[PY_PATH],{input:content_with_EOL,encoding:'utf-8'});

    // console.log(data.stdout);
    // console.log(data.stderr);
    console.log(`Score.ts:${data.stdout}`)
    return data.stdout
}


export default Score
