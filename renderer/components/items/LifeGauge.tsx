import { Container } from '@inlet/react-pixi'

import { HeartProps } from '../../types/heart'
import FullHeart from './hearts/FullHeart'
import HalfHeart from './hearts/HalfHeart'
import EmptyHeart from './hearts/EmptyHeart'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
  n: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 1 -> ハート半個
}

type HeartNode = ({ x, y, scale }: HeartProps) => JSX.Element

const LifeGauge = ({ x = 0, y = 0, scale = 1, n }: Props) => {
  let Heart1: HeartNode, Heart2: HeartNode, Heart3: HeartNode
  if (n === 0) {
    Heart1 = EmptyHeart
    Heart2 = EmptyHeart
    Heart3 = EmptyHeart
  } else if (n === 1) {
    Heart1 = HalfHeart
    Heart2 = EmptyHeart
    Heart3 = EmptyHeart
  } else if (n === 2) {
    Heart1 = FullHeart
    Heart2 = EmptyHeart
    Heart3 = EmptyHeart
  } else if (n === 3) {
    Heart1 = FullHeart
    Heart2 = HalfHeart
    Heart3 = EmptyHeart
  } else if (n === 4) {
    Heart1 = FullHeart
    Heart2 = FullHeart
    Heart3 = EmptyHeart
  } else if (n === 5) {
    Heart1 = FullHeart
    Heart2 = FullHeart
    Heart3 = HalfHeart
  } else if (n === 6) {
    Heart1 = FullHeart
    Heart2 = FullHeart
    Heart3 = FullHeart
  } else {
    throw new Error('0 ～ 6 以外の数値がpropsに渡されました')
  }

  return (
    <Container x={x} y={y} scale={scale}>
      <Heart1 x={0} />
      <Heart2 x={35} />
      <Heart3 x={70} />
    </Container>
  )
}

export default LifeGauge
