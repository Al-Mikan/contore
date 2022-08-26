import { Sprite, Container } from '@inlet/react-pixi'

const Level = ({ level }) => {
  const n: String = String(level)

  let fi, se, th: String

  if (n.length == 3) {
    fi = n[0]
    se = n[1]
    th = n[2]
  } else if (n.length == 2) {
    fi = '0'
    se = n[0]
    th = n[1]
  } else {
    fi = '0'
    se = '0'
    th = n[0]
  }

  return (
    <Container position={[100, 0]} x={900} y={-120}>
      <Sprite image={`img/number/${fi}.png`} x={0} />
      <Sprite image={`img/number/${se}.png`} x={47} />
      <Sprite image={`img/number/${th}.png`} x={100} />
    </Container>
  )
}

export default Level
