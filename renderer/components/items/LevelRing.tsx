import { Container } from '@inlet/react-pixi'
import { useContext } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import ExperiencePoint from '../../utils/ExperiencePoint'
import { GameContext } from '../containers/CanvasContext'
import LevelBar from './LevelBar'
import LevelText from './LevelText'
import NumText from './NumText'

interface Props extends BasicSpriteProps {}

const LevelRing = ({ x = 0, y = 0, scale = 1 }: Props) => {
  const { experiencePoint } = useContext(GameContext)
  const ex = new ExperiencePoint(experiencePoint)

  return (
    <Container x={x} y={y} scale={scale}>
      <LevelBar n={ex.progress(8)} />
      <LevelText x={250} y={280} />
      <NumText
        n={ex.get_level()}
        view_digits={3}
        x={175}
        y={230}
        is_headzero_displayed={true}
      />
    </Container>
  )
}

export default LevelRing
