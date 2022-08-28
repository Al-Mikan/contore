import { useEffect } from 'react'
import { Container, Sprite } from '@inlet/react-pixi'

import Num from './Num'
import { shouldStrToNum } from '../../utils/api'

interface Props {
  x?: number
  y?: number
  scale?: number
  time: String
  setTime: (v: string) => void
}

const Timer = ({ x = 0, y = 0, scale = 1, time, setTime }: Props) => {
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
    <Container x={x} y={y} scale={scale}>
      <Num n={shouldStrToNum(time[0])} x={0} />
      <Num n={shouldStrToNum(time[1])} x={50} />
      <Sprite image="/img/number/colon.png" x={100} />
      <Num n={shouldStrToNum(time[3])} x={150} />
      <Num n={shouldStrToNum(time[4])} x={200} />
      <Sprite image="/img/number/colon.png" x={250} />
      <Num n={shouldStrToNum(time[6])} x={300} />
      <Num n={shouldStrToNum(time[7])} x={350} />
    </Container>
  )
}

export default Timer
