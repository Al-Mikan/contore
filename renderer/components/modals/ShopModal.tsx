import { useState, useEffect } from 'react'
import { Sprite, Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import CloseBtn from '../buttons/CloseBtn'
import BuyBtn from '../buttons/BuyBtn'
import { BasicSpriteProps } from '../../types/sprite'
import Fish from '../items/Fish'
import Coin from '../items/Coin'
import NumText from '../items/NumText'
import {
  shouldFetchCoins,
  shouldFetchFish,
  updateCoreCoin,
  updateShopFish,
} from '../../utils/model'

interface Props extends BasicSpriteProps {
  handleClickToHome: (event: InteractionEvent) => void // Note: useRouterをResultModalから呼ぶとnullが返るのでpropsとして受け取る
}

const SettingModal = ({
  x = 0,
  y = 0,
  scale = 1,
  handleClickToHome,
}: Props) => {
  const [coins, setCoins] = useState(0)
  const [fish, setFish] = useState(0)
  const [dragMode, setDragMode] = useState(false)
  const [pos, setPos] = useState<Position>({ x: x, y: y })
  const [beforeMousePos, setBeforeMousePos] = useState<Position>({ x: 0, y: 0 })

  const BuyFish = async (price: number) => {
    if (coins - price < 0) {
      // alertを表示する
      return
    }
    await updateCoreCoin(coins - price)
    setCoins((prev) => prev - price)
    await updateShopFish(fish + 1)
    setFish((prev) => prev + 1)
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
    const stateInitCoins = async () => {
      // コイン枚数の設定
      setCoins(await shouldFetchCoins())
    }
    const stateInitFish = async () => {
      setFish(await shouldFetchFish())
    }

    // 並行に実行
    stateInitCoins()
    stateInitFish()
  }, [])

  return (
    <Sprite
      anchor={0.5}
      image="/static/img/modal.png"
      visible={true}
      x={pos.x}
      y={pos.y}
      scale={scale}
      interactive={true}
      containsPoint={containsPointClickThrouth}
      mousedown={mouseDown}
      mousemove={mouseMove}
      mouseup={mouseUp}
      mouseupoutside={mouseUp}
    >
      <Container x={-100} y={-50}>
        <Text
          text="fish"
          x={0}
          y={0}
          style={
            new TextStyle({
              fontSize: 50,
              fontWeight: '700',
              fontFamily: 'neue-pixel-sans',
            })
          }
        />
        <Text
          text={`× ${fish}`}
          x={60}
          y={-25}
          style={
            new TextStyle({
              fontSize: 20,
              fontWeight: '700',
              fontFamily: 'neue-pixel-sans',
            })
          }
        />
        <Fish x={5} y={-10} scale={0.1} />
        <BuyBtn
          x={50}
          y={75}
          scale={0.6}
          handleStartClick={() => {
            BuyFish(1)
          }}
        />
      </Container>
      <Container x={40} y={130} scale={0.5}>
        <Coin />
        <NumText n={coins} view_digits={4} x={70} y={-25} />
      </Container>
      <CloseBtn
        handleClick={handleClickToHome}
        x={150}
        y={-175}
        scale={0.4}
      ></CloseBtn>
    </Sprite>
  )
}

export default SettingModal
