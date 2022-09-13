import { Container, Sprite, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'
import { useContext, useState } from 'react'

import useDragMe from '../../hooks/useDragMe'
import { Position } from '../../types/character'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import BuyBtn from '../buttons/BuyBtn'
import CloseBtn from '../buttons/CloseBtn'
import { GameContext } from '../containers/CanvasContext'
import Coin from '../items/Coin'
import CuteFish from '../items/CuteFish'
import Minus from '../items/Minus'
import NumCon from '../items/NumCon'
import NumText from '../items/NumText'
import Plus from '../items/Plus'
import ShopTitle from '../items/ShopTitle'

interface Props extends BasicSpriteProps {
  handleCloseClcik: (e: InteractionEvent) => void
}

const SettingModal = ({ x = 0, y = 0, scale = 1, handleCloseClcik }: Props) => {
  const { coin, fish, plusCoinInStateAndDB, plusFishInStateAndDB } =
    useContext(GameContext)
  const [modalPosition, setModalPosition] = useState<Position>({ x: x, y: y })
  const [isDragging, { mouseDown, mouseMove, mouseUp }] = useDragMe(
    (position: Position) => {
      setModalPosition(position)
    }
  )
  const [buyFish, setBuyFish] = useState(0)

  const minusHandleClick = () => {
    setBuyFish(Math.max(0, buyFish - 1))
  }

  const plusHandleClick = () => {
    setBuyFish(Math.min(coin, buyFish + 1))
  }

  const BuyFish = async (price: number) => {
    if (coin - price < 0) {
      // alertを表示する
      return
    }
    await plusCoinInStateAndDB(-price)
    await plusFishInStateAndDB(price)
  }

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
      <Container x={-100} y={-50}>
        <ShopTitle x={100} y={-80} />
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
        <NumText n={coin} view_digits={4} x={70} y={-40} />
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
