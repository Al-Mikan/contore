import { AnimatedSprite, Container, useTick } from '@inlet/react-pixi'
import { useState } from 'react'

import { containsPoint } from '../../utils/pixi_api'
import { getRandomInt } from '../../utils/api'

const BASIC_ANIMATION = 0
const BLINK_ANIMATION = 1

const MiniCat = () => {
  const basicAnimationImages = ['/img/mini-cat/1.png']
  const blinkAnimationImages = [
    '/img/mini-cat/1.png',
    '/img/mini-cat/2.png',
    '/img/mini-cat/3.png',
    '/img/mini-cat/2.png',
  ]

  const [moveTick, setMoveTick] = useState(0) // 提起的に移動を実行する
  const [target, setTarget] = useState(0) // 移動先のX座標
  const [nowP, setNowP] = useState(900) // 現在位置のX座標
  const [currentAnimation, setCurrentAnimation] = useState(0) // 現在のアニメーション

  /* 次の位置に移動する */
  const next_pos = () => {
    /* 0を基準に -move_w/4 <= x <= move_w/4で移動をする */
    if (nowP == target) return

    const direction = (target - nowP) / Math.abs(target - nowP)
    setNowP((prev) => prev + direction)
  }

  /* clickでアニメーションを切り替え */
  const switchAnimation = (target: 0 | 1) => {
    /* 基本型からのみ変更を許可 */
    if (currentAnimation !== BASIC_ANIMATION) return
    setCurrentAnimation(target)
  }

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCurrentAnimation(BASIC_ANIMATION)
  }

  useTick((_) => {
    /* durationごとにターゲットを変更 */
    const interval = 500
    if (moveTick == 0) {
      setTarget(getRandomInt(500, 1100))
    }
    next_pos()
    setMoveTick((prev) => (prev + 1) % interval)

    /* たまに瞬きをする */
    if (Math.random() <= 0.005) {
      switchAnimation(BLINK_ANIMATION)
    }
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
        x={nowP}
        y={750}
        scale={1.5}
        interactive={true}
        visible={currentAnimation == BASIC_ANIMATION}
        pointerdown={() => switchAnimation(BLINK_ANIMATION)}
        containsPoint={containsPoint}
      />
      {/* 瞬き */}
      <AnimatedSprite
        anchor={0.5}
        images={blinkAnimationImages}
        isPlaying={currentAnimation == BLINK_ANIMATION}
        initialFrame={0}
        animationSpeed={0.1}
        x={nowP}
        y={750}
        scale={1.5}
        visible={currentAnimation == BLINK_ANIMATION}
        loop={false}
        onComplete={handleComplete}
        containsPoint={containsPoint}
      />
    </Container>
  )
}

export default MiniCat
