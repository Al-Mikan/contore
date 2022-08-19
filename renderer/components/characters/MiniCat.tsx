import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'

const MiniCat = () => {
  const basicAnimationImages = ['/img/mini-cat/1.png']
  const blindAnimationImages = [
    '/img/mini-cat/1.png',
    '/img/mini-cat/2.png',
    '/img/mini-cat/3.png',
    '/img/mini-cat/2.png',
  ]
  const move_w = 800
  
  const [visibleList, setVisibleList] = useState([true, false])
  const [moveTick, setMoveTick] = useState(0)

  const character_move_pos = (p: number) => {
    /* 0を基準に -move_w/4 <= x <= move_w/4で移動をする */
    const quarter = move_w/4;
    if (p < 1*quarter) {
      // ->
      return p
    } else if (p < 2*quarter) {
      // <-
      return quarter - (p - quarter)
    } else if (p < 3*quarter) {
      // <-
      return 2 * quarter - p
    } else {
      // ->
      return -quarter + (p-3*quarter)
    }
  }
  /* clickでアニメーションを切り替え */
  const switchAnimation = () => {
    const f = visibleList[0]
    if (f) {
      setVisibleList([false, true])
    } else {
      setVisibleList([true, false])
    }
  }

  useTick((_) => {
    setMoveTick((moveTick + 1) % move_w)
  })

  return (
    <Container>
      {/* 基礎モーション */}
      <AnimatedSprite
        anchor={0.5}
        images={basicAnimationImages}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.05}
        x={900 + character_move_pos(moveTick)}
        y={750}
        scale={1.5}
        interactive={true}
        visible={visibleList[0]}
        pointerdown={switchAnimation}
        containsPoint={containsPoint}
      />
      {/* 瞬き */}
      <AnimatedSprite
        anchor={0.5}
        images={blindAnimationImages}
        isPlaying={visibleList[1]}
        initialFrame={0}
        animationSpeed={0.1}
        x={900 + character_move_pos(moveTick)}
        y={750}
        scale={1.5}
        visible={visibleList[1]}
        loop={false}
        onComplete={switchAnimation}
        containsPoint={containsPoint}
      />
    </Container>
  )
}

export default MiniCat
