import { useState, useEffect } from 'react'
import { Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'

function Timer() {
  const dateToTimeString = (d: Date) => d.toTimeString().slice(0, 8)

  let [time, setTime] = useState('00:00:00')
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
      x={400}
      y={150}
      style={
        new TextStyle({
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
          fontSize: 70,
          letterSpacing: 20,
          fill: '#ffffff',
        })
      }
    ></Text>
  )
}

export default Timer
