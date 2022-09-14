import { Container, Sprite } from '@inlet/react-pixi'
import { useContext } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import { getTotalPlayTimeinDays } from '../../utils/common'
import { GameContext } from '../containers/CanvasContext'
import NumText from './NumText'

interface Props extends BasicSpriteProps {}

const Board = ({ x = 0, y = 0, scale = 1 }: Props) => {
  const { startDate } = useContext(GameContext)
  const playTimeInDays = getTotalPlayTimeinDays(new Date(startDate))

  return (
    <Container x={x} y={y} scale={scale}>
      <Sprite image="/static/img/board.png" />
      <Sprite image="/static/img/days.png" x={310} y={220} scale={0.9} />
      {/*  一日目からスタート */}
      <NumText
        x={135}
        y={221}
        scale={0.6}
        n={playTimeInDays + 1}
        view_digits={5}
      />
    </Container>
  )
}

export default Board
