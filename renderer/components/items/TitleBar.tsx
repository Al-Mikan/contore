import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'

import useDrag from '../../hooks/useDrag'
import { Position } from '../../types/character'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import CloseBtn from '../buttons/CloseBtn'

interface Props extends BasicSpriteProps {
  setPositionHook: (position: Position) => void
}

const TitleBar = ({ x = 0, y = 0, scale = 1, setPositionHook }: Props) => {
  const [dragMode, mouseDown, mouseMove, mouseUp] = useDrag(setPositionHook)

  const handleCloseClick = (event: InteractionEvent) => {
    window.electronAPI.closeWindow()
  }

  return (
    <>
      <Sprite
        image="/static/img/title-bar.png"
        x={x}
        y={y}
        scale={scale}
        interactive={true}
        containsPoint={containsPointClickThrouth}
        mousedown={mouseDown}
        mousemove={mouseMove}
        mouseup={mouseUp}
        mouseupoutside={mouseUp}
      >
        <CloseBtn
          x={5}
          y={2}
          scale={0.4}
          handleClick={handleCloseClick}
          isClickThrouth={true}
        />
      </Sprite>
    </>
  )
}

export default TitleBar
