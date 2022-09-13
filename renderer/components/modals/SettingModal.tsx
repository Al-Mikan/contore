import { Container, Sprite } from '@inlet/react-pixi'
import { useRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { useCallback, useEffect, useState } from 'react'

import useDragMe from '../../hooks/useDragMe'
import { Position } from '../../types/character'
import { Setting } from '../../types/other'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import {
  shouldFetchSetting,
  updateSettingCamera,
  updateSettingDrag,
} from '../../utils/model'
import CloseBtn from '../buttons/CloseBtn'
import OptionTitle from '../items/OptionTitle'
import SettingItem from '../items/SettingItem'

interface Props extends BasicSpriteProps {
  handleCloseClcik: (e: InteractionEvent) => void
}

const SettingModal = ({ x = 0, y = 0, scale = 1, handleCloseClcik }: Props) => {
  const [modalPosition, setModalPosition] = useState<Position>({ x: x, y: y })
  const [isDragging, { mouseDown, mouseMove, mouseUp }] = useDragMe(
    (position: Position) => {
      setModalPosition(position)
    }
  )
  //toggleの処理
  const [setting, setSetting] = useState<Setting>({
    camera: true,
    drag: true,
  })

  const handleToggleChange = useCallback(
    (event: InteractionEvent) => {
      if (!event.target.name) throw new Error('setting: 未対応のイベントです')

      // イベント移譲
      if (event.target.name.trim() === 'camera') {
        const updateSettingCameraState = async () => {
          await updateSettingCamera(!setting.camera)
          setSetting((prev) => ({
            ...prev,
            camera: !prev.camera,
          }))
        }
        updateSettingCameraState()
      } else if (event.target.name.trim() === 'drag') {
        const updateSettingDragState = async () => {
          await updateSettingDrag(!setting.drag)
          setSetting((prev) => ({
            ...prev,
            drag: !prev.drag,
          }))
        }
        updateSettingDragState()
      } else {
        throw new Error('setting: 未対応のイベントです')
      }
    },
    [setting]
  )

  useEffect(() => {
    const stateInitSetting = async () => {
      setSetting(await shouldFetchSetting())
    }

    stateInitSetting()
  }, [])

  return (
    <Sprite
      anchor={0.5}
      image="/static/img/modal.png"
      visible={true}
      x={modalPosition.x}
      y={modalPosition.y}
      scale={scale}
      interactive={true}
      containsPoint={containsPointClickThrouth}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    >
      <Container x={-70} y={-70}>
        <OptionTitle x={70} y={-70} />
        <SettingItem
          x={0}
          y={0}
          text="camera"
          isOn={setting.camera}
          handleClick={handleToggleChange}
        />
        <SettingItem
          x={0}
          y={50}
          text="drag"
          isOn={setting.drag}
          handleClick={handleToggleChange}
        />
      </Container>
      <CloseBtn
        handleClick={handleCloseClcik}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default SettingModal
