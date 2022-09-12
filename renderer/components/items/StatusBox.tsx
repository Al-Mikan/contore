import { Container } from '@inlet/react-pixi'
import { useContext } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import ExperiencePoint from '../../utils/ExperiencePoint'
import HealthPoint from '../../utils/HealthPoint'
import { GameContext } from '../containers/CanvasContext'
import Coin from './Coin'
import CuteFish from './CuteFish'
import Level from './Level'
import LevelBar from './LevelBar'
import LifeGauge from './LifeGauge'
import NumText from './NumText'

interface Props extends BasicSpriteProps {}

const StatusBox = ({ x = 0, y = 0, scale = 1 }: Props) => {
  const { coin, fish, experiencePoint, health } = useContext(GameContext)
  const ex = new ExperiencePoint(experiencePoint)
  const hp = new HealthPoint(health)

  return (
    <Container x={x} y={y} scale={scale}>
      <Container>
        <LevelBar n={ex.progress(8)} x={-60} y={-30} scale={0.75} />
        <Level x={130} y={170} scale={0.7} />
        <NumText
          n={ex.get_level()}
          view_digits={3}
          x={80}
          y={140}
          scale={0.65}
          is_headzero_displayed={true}
        />
      </Container>
      <LifeGauge
        n={hp.get_health_point_formatted(10)}
        x={30}
        y={330}
        scale={1.2}
      />
      <Container x={-40} y={420} scale={0.5}>
        <Coin />
        <NumText n={coin} view_digits={4} x={75} y={-25} scale={0.8} />
      </Container>
      <Container x={170} y={425} scale={0.3}>
        <CuteFish />
        <NumText n={fish} view_digits={4} x={200} y={-63} scale={1.4} />
      </Container>
    </Container>
  )
}

export default StatusBox
