import { NextRouter } from 'next/router'
import { InteractionEvent } from 'pixi.js'
import { Sprite } from '@inlet/react-pixi'
import { useEffect, useState, useContext } from 'react'

import LevelBar from '../items/LevelBar'
import MiniCat from '../characters/MiniCat'
import LifeGauge from '../items/LifeGauge'
import Coin from '../items/Coin'
import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import StartBtn from '../buttons/StartBtn'
import SettingBtn from '../buttons/SettingBtn'
import EndBtn from '../buttons/EndBtn'
import ExperiencePoint from '../../utils/ExperiencePoint'
import NumText from '../items/NumText'
import { HealthContext } from '../containers/CanvasContext'
import HealthPoint from '../../utils/HealthPoint'

interface Props {
  router: NextRouter
}

const IndexPage = ({ router }: Props) => {
  const { health } = useContext(HealthContext)
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: 350, y: 200 })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })
  const [experience, setExperience] = useState(0)
  const [coins, setCoins] = useState(0)

  const ex = new ExperiencePoint(experience)
  const hp = new HealthPoint(health)

  // 背景画像のサイズを元に調整する
  const miniCatBorder = {
    minX: 0 - 50,
    maxX: 640 + 50,
    minY: 0,
    maxY: 293,
    randomTargetMinX: 0 - 10,
    randomTargetMaxX: 640 + 10,
  }

  const handleStartClick = (event: InteractionEvent) => {
    router.push('/concentrate')
  }
  const handleSettingClick = (event: InteractionEvent) => {
    router.push('/setting')
  }
  const handleEndClick = (event: InteractionEvent) => {
    electronAPI.closeWindow()
  }

  // ドラッグ操作
  const mouseDown = (event: InteractionEvent) => {
    const nx = event.data.global.x
    const ny = event.data.global.y
    setDragMode(true)
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseMove = (event: InteractionEvent) => {
    if (!dragMode) return
    /* currentTargetがnullのバグが発生したので条件分岐する */
    if (event.currentTarget === null || event.currentTarget === undefined)
      return
    /* クリックした場所から移動した差だけ移動する */
    /* nx,nyにセットすると、端っこをクリックすると始め瞬間移動するので必要 */
    const nx = event.data.global.x
    const ny = event.data.global.y
    const currentCharacterPosX = event.currentTarget.x
    const currentCharacterPosY = event.currentTarget.y
    setPos({
      x: currentCharacterPosX + (nx - beforeMousePos.x),
      y: currentCharacterPosY + (ny - beforeMousePos.y),
    })
    setBeforeMousePos({ x: nx, y: ny })
  }

  const mouseUp = (event: InteractionEvent) => {
    setDragMode(false)
  }

  useEffect(() => {
    const fetchExperience = async () => {
      // 経験値の設定
      const nowEx: number = await window.database.read('core.experience_point')
      if (nowEx === undefined) {
        throw new Error('electron-store: core.experience_pointが存在しません')
      }
      setExperience(nowEx)
    }
    const fetchCoins = async () => {
      // コイン枚数の設定
      const nowCoins: number = await window.database.read('core.coin')
      if (nowCoins === undefined) {
        throw new Error('electron-store: core.coinが存在しません')
      }
      setCoins(nowCoins)
    }
    const fetchLastLoginAndUpdateHP = async () => {
      const last_login: string = await window.database.read('core.last_login')
      if (last_login === undefined) {
        throw new Error('electron-store: core.last_loginが存在しません')
      }
      const date_last_login = new Date(last_login)
      const date_now = new Date()
      const blank = Math.floor(
        (date_last_login.getTime() - date_now.getTime()) / 1000
      )
    }

    // 非同期処理を並行に実行
    fetchExperience()
    fetchCoins()
    fetchLastLoginAndUpdateHP()
  }, [])

  return (
    <Sprite
      image={'/img/background.png'} // 640 * 360
      x={pos.x}
      y={pos.y}
      width={1280}
      height={720}
      interactive={true}
      containsPoint={containsPointClickThrouth}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    >
      <MiniCat
        defaultX={200}
        defaultY={293}
        scale={0.5}
        border={miniCatBorder}
        isClickThrough={true} // 画面外でも正常にクリック可能に
      />
      <Sprite image="/img/board.png" x={50} scale={0.5} />
      <LevelBar n={ex.progress(10)} x={440} y={20} scale={0.7} />
      <NumText
        n={ex.get_level()}
        view_digits={3}
        x={560}
        y={23}
        scale={0.2}
        is_headzero_displayed={true}
      />
      <Coin x={320} y={30} scale={0.3} />
      <NumText n={coins} view_digits={4} x={350} y={23} scale={0.3} />
      <LifeGauge
        n={hp.get_health_point_formatted(10)}
        x={450}
        y={60}
        scale={0.8}
      />
      <SettingBtn
        handleSettingClick={handleSettingClick}
        x={595}
        y={13}
        scale={0.4}
      />
      <StartBtn
        handleStartClick={handleStartClick}
        x={400}
        y={315}
        scale={0.8}
      />
      <EndBtn handleClick={handleEndClick} x={520} y={315} scale={0.8} />
    </Sprite>
  )
}

export default IndexPage
