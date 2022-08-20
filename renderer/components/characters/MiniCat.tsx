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
  const defaultX = 900
  const defaultY = 750
  const [moveTick, setMoveTick] = useState(0) // 提起的に移動を実行する
  const [targetX, setTargetX] = useState(defaultX) // 移動先のX座標
  const [targetY, setTargetY] = useState(defaultY) // 移動先のY座標
  const [nowX, setNowX] = useState(defaultX) // 現在位置のX座標
  const [nowY, setNowY] = useState(defaultY) // 現在位置のY座標
  const [currentAnimation, setCurrentAnimation] = useState(0) // 現在のアニメーション

  /* 次の位置に移動する */
  const next_posX = () => {
    const speed = 2
    if (nowX == targetX) return

    const directionX = (targetX - nowX) / Math.abs(targetX - nowX)
    if (directionX > 0) {
      /* -> */
      setNowX((prev) => Math.min(prev + directionX * speed, targetX))
    } else {
      /* <- */
      setNowX((prev) => Math.max(prev + directionX * speed, targetX))
    }
  }

  const next_posY = () => {
    const speed = 2

    if (targetY == nowY) {
      if (defaultY == nowY) {
        /* 初期位置 */
        return
      } else {
        /* ジャンプの頂上。落下を開始 */
        setTargetY(defaultY)
        return
      }
    }

    const directionY = (targetY - nowY) / Math.abs(targetY - nowY)
    if (directionY > 0) {
      /* 落下中 */
      setNowY((prev) => Math.min(prev + directionY * speed, targetY))
    } else {
      /* 上昇中 */
      setNowY((prev) => Math.max(prev + directionY * speed, targetY))
    }
  }

  /* clickでアニメーションを切り替え */
  const switchAnimation = (targetAnimation: 0 | 1) => {
    /* 基本型からのみ変更を許可 */
    if (currentAnimation !== BASIC_ANIMATION) return
    setCurrentAnimation(targetAnimation)
  }

  /* 基本アニメーション以外で使用 */
  const handleComplete = () => {
    setCurrentAnimation(BASIC_ANIMATION)
  }

  const startJump = () => {
    const height = 50
    /* 2段ジャンプは不可 */
    if (nowY != defaultY) return
    setTargetY(defaultY - height)
  }

  useTick((_) => {
    /* durationごとにターゲットを変更 */
    const interval = 500
    if (moveTick == 0) {
      setTargetX(getRandomInt(500, 1100))
    }
    next_posX()
    next_posY()
    setMoveTick((prev) => (prev + 1) % interval)

    /* たまに瞬きをする */
    if (Math.random() <= 0.005) {
      switchAnimation(BLINK_ANIMATION)
    }

    /* たまにジャンプする */
    if (Math.random() <= 0.001) {
      startJump()
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
        x={nowX}
        y={nowY}
        scale={1.5}
        interactive={true}
        visible={currentAnimation == BASIC_ANIMATION}
        pointerdown={startJump} /* jump */
        containsPoint={containsPoint}
      />
      {/* 瞬き */}
      <AnimatedSprite
        anchor={0.5}
        images={blinkAnimationImages}
        isPlaying={currentAnimation == BLINK_ANIMATION}
        initialFrame={0}
        animationSpeed={0.1}
        x={nowX}
        y={nowY}
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
