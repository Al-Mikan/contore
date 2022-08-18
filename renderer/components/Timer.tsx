import { useEffect } from 'react'
import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

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
    <Text
      text={time}
      x={550}
      y={250}
      style={
        new TextStyle({
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
          fontSize: 150,
          letterSpacing: 20,
          fill: '#ffffff',
        })
      }
    ></Text>
  )
}

export default Timer
