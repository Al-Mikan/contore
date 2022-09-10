import { useEffect } from 'react'
import { Container, Sprite } from '@inlet/react-pixi'

import WhiteNum from './WhiteNum'
import { shouldStrToNum } from '../../utils/common'
import { BasicSpriteProps } from '../../types/sprite'

interface Props extends BasicSpriteProps {
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
      <WhiteNum n={shouldStrToNum(time[0])} x={0} />
      <WhiteNum n={shouldStrToNum(time[1])} x={50} />
      <Sprite image="/static/img/white-border-number/colon.png" x={115} y={5} />
      <WhiteNum n={shouldStrToNum(time[3])} x={150} />
      <WhiteNum n={shouldStrToNum(time[4])} x={200} />
      <Sprite image="/static/img/white-border-number/colon.png" x={265} y={5} />
      <WhiteNum n={shouldStrToNum(time[6])} x={300} />
      <WhiteNum n={shouldStrToNum(time[7])} x={350} />
    </Container>
  )
}

export default Timer
