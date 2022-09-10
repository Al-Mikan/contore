import { Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'
// import { BasicSpriteProps } from '../../types/sprite'

// interface Props extends BasicSpriteProps {

// }

const Loading = () =>{
    return (
        <Container>
            <Text
                text="カメラの起動中です！"
            ></Text>
        </Container>
    );
}

export default Loading 