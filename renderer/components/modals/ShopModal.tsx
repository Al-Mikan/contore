import { useState, useEffect } from 'react'
import { Sprite, Text, Container } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'

import { Position } from '../../types/character'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import CloseBtn from '../buttons/CloseBtn'
import BuyBtn from '../buttons/BuyBtn'
import { BasicSpriteProps } from '../../types/sprite'
import CuteFish from '../items/CuteFish'
import Coin from '../items/Coin'
import NumText from '../items/NumText'
import {
  shouldFetchCoins,
  shouldFetchFish,
  updateCoreCoin,
  updateShopFish,
} from '../../utils/model'
import ShopTitle from '../items/ShopTitle'
import Minus from '../items/Minus'
import Plus from '../items/Plus'
import NumCon from '../items/NumCon'

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
  const [buyFish, setBuyFish] = useState(0)

  const minusHandleClick = () => {
    setBuyFish(Math.max(0, buyFish - 1))
  }

  const plusHandleClick = () => {
    setBuyFish(Math.min(coins, buyFish + 1))
  }

  const BuyFish = async (price: number) => {
    if (coins - price < 0) {
      // alertを表示する
      return
    }
    await updateCoreCoin(coins - price)
    setCoins((prev) => prev - price)
    await updateShopFish(fish + price)
    setFish((prev) => prev + price)
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
    return () => {
      window.location.reload()
    }
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
        <ShopTitle x={100} y={-80} />
        {/* <Text
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
        /> */}
        {/* <Text
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
        /> */}
        <CuteFish x={5} y={14} scale={0.4} />
        <Container x={-55} y={-35} scale={1.3}>
          <Minus x={117} y={15} handleClick={minusHandleClick} />
          <NumCon x={145} y={12} />
          <Text
            anchor={0.5}
            x={188}
            y={33}
            text={`${buyFish}`}
            style={
              new TextStyle({
                fontSize: 25,
                fontWeight: '700',
                fontFamily: 'neue-pixel-sans',
              })
            }
          />
          <Plus x={232} y={16} handleClick={plusHandleClick} />
        </Container>

        <Container>
          <Text
            x={0}
            y={45}
            text={`=`}
            style={
              new TextStyle({
                fontSize: 60,
                fontWeight: '700',
                fontFamily: 'neue-pixel-sans',
              })
            }
          />
          <Coin x={100} y={90} scale={0.5} />
          <Text
            x={150}
            y={60}
            text={`x ${buyFish}`}
            style={
              new TextStyle({
                fontSize: 45,
                fontWeight: '700',
                fontFamily: 'neue-pixel-sans',
              })
            }
          />
        </Container>

        <BuyBtn
          x={-20}
          y={150}
          scale={0.7}
          handleStartClick={() => {
            BuyFish(buyFish)
          }}
        />
      </Container>
      <Container x={70} y={140} scale={0.3}>
        <Coin />
        <NumText n={coins} view_digits={4} x={70} y={-40} />
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
