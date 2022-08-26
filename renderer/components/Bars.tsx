import { Sprite } from "@inlet/react-pixi"

const Bar = (props) => {
    return (
        <Sprite
            image={`img/bars/${props.n}.jpeg`}
            width={800}
            height={650}
            x = {1200}
            y = {-50}
        />
    )
}

export default Bar 