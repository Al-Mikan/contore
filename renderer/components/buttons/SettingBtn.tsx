import { Sprite } from '@inlet/react-pixi'
import { InteractionEvent } from 'pixi.js'
import { useState } from 'react'

import { containsPoint, containsPointClickThrouth } from '../../utils/pixi_api'

interface Props {
  x?: number
  y?: number
  scale?: number
  isClickThrouth?: boolean
  handleSettingClick: (event: InteractionEvent) => void
}

const SettingBtn = ({ x = 0, y = 0, scale = 1, handleSettingClick }: Props) => {
  return (
    <Sprite
      image="/img/hamburger.png"
      x={x}
      y={y}
      scale={scale}
      interactive={true}
      click={handleSettingClick}
      buttonMode={true}
    />
  )
}

export default SettingBtn
