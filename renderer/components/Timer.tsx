import { useEffect } from 'react'
import { Container, Sprite } from '@inlet/react-pixi'

interface Props {
  time: string
  setTime: (v: string) => void
}

const Timer = ({ time, setTime }: Props) => {
  const dateToTimeString = (d: Date) => d.toTimeString().slice(0, 8)

  useEffect(() => {
    const d = new Date()
    d.setDate(0)
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)

    const interval = setInterval(() => {
      d.setSeconds(d.getSeconds() + 1)
      setTime(dateToTimeString(d))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Container x={0} y={-100}>
      <Sprite image={'/img/number/' + time[0] + '.png'} x={100} scale={2} />
      <Sprite image={'/img/number/' + time[1] + '.png'} x={200} scale={2} />
      <Sprite image="/img/number/colon.png" x={300} y={15} scale={2} />
      <Sprite image={'/img/number/' + time[3] + '.png'} x={400} scale={2} />
      <Sprite image={'/img/number/' + time[4] + '.png'} x={500} scale={2} />
      <Sprite image="/img/number/colon.png" x={600} y={15} scale={2} />
      <Sprite image={'/img/number/' + time[6] + '.png'} x={700} scale={2} />
      <Sprite image={'/img/number/' + time[7] + '.png'} x={800} scale={2} />
    </Container>
  )
}

export default Timer
