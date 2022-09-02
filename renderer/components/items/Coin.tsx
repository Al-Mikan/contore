import { AnimatedSprite } from '@inlet/react-pixi'

import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {}

/* 1.pngは停止中のコイン */
const coinImages = [
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/1.png',
  '/img/coins/2.png',
  '/img/coins/3.png',
  '/img/coins/4.png',
  '/img/coins/5.png',
  '/img/coins/6.png',
]

const LevelBar = ({ x = 0, y = 0, scale = 1 }: Props) => {
  return (
    <AnimatedSprite
      images={coinImages}
      anchor={0.5}
      isPlaying={true}
      initialFrame={0}
      animationSpeed={0.1}
      x={x}
      y={y}
      scale={scale}
    />
  )
}

export default LevelBar
