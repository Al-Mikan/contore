import { Container } from '@inlet/react-pixi'
import { useContext } from 'react'

import { BasicSpriteProps } from '../../types/sprite'
import HealthPoint from '../../utils/HealthPoint'
import { GameContext } from '../containers/CanvasContext'
import Coin from './Coin'
import CuteFish from './CuteFish'
import LevelRing from './LevelRing'
import LifeGauge from './LifeGauge'
import NumText from './NumText'

interface Props extends BasicSpriteProps {}

const StatusBox = ({ x = 0, y = 0, scale = 1 }: Props) => {
  const { coin, fish, health } = useContext(GameContext)
  const hp = new HealthPoint(health)

  return (
    <Container x={x} y={y} scale={scale}>
      <LevelRing x={-70} y={-40} scale={0.8} />
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
