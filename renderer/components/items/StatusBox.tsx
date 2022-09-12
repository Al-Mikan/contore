import { Container } from '@inlet/react-pixi'

import Coin from './Coin'
import CuteFish from './CuteFish'
import Level from './Level'
import LevelBar from './LevelBar'
import LifeGauge from './LifeGauge'
import NumText from './NumText'

const StatusBox = () => {
  return (
    <Container>
      <Container x={1170} y={180} scale={1}>
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
      <Container x={1150} y={600} scale={0.6}>
        <Coin x={-20} scale={0.8} />
        <NumText n={coins} view_digits={4} x={50} y={-25} scale={0.7} />
      </Container>
      <LifeGauge
        n={hp.get_health_point_formatted(10)}
        x={1200}
        y={510}
        scale={1.2}
      />
      <Container x={1300} y={600} scale={0.6}>
        <CuteFish x={60} y={8} scale={0.4} />
        <NumText n={fish} view_digits={4} x={150} y={-25} scale={0.7} />
      </Container>
    </Container>
  )
}

export default StatusBox
