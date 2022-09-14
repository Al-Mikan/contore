import { Container, Sprite, Text } from '@inlet/react-pixi'
import { InteractionEvent, TextStyle } from 'pixi.js'
import { useContext, useState } from 'react'

import useCounter from '../../hooks/useCounter'
import useDragMe from '../../hooks/useDragMe'
import { Position } from '../../types/character'
import { BasicSpriteProps } from '../../types/sprite'
import { containsPointClickThrouth } from '../../utils/PixiAPI'
import BuyBtn from '../buttons/BuyBtn'
import CloseBtn from '../buttons/CloseBtn'
import CountBtn from '../buttons/original/CountBtn'
import { GameContext } from '../containers/CanvasContext'
import Coin from '../items/Coin'
import CuteFish from '../items/CuteFish'
import NumText from '../items/NumText'
import ShopTitle from '../items/ShopTitle'

interface Props extends BasicSpriteProps {
  handleCloseClcik: (e: InteractionEvent) => void
}

const SettingModal = ({ x = 0, y = 0, scale = 1, handleCloseClcik }: Props) => {
  const { coin, plusCoinInStateAndDB, plusFishInStateAndDB } =
    useContext(GameContext)
  const [modalPosition, setModalPosition] = useState<Position>({ x: x, y: y })
  const [isDragging, { mouseDown, mouseMove, mouseUp }] = useDragMe(
    (position: Position) => {
      setModalPosition(position)
    }
  )
  const [buyFishCount, { plusCount, minusCount }] = useCounter(0, coin)
  const fishPrice = 1

  const BuyFish = async (n: number) => {
    if (n <= 0) return

    const totalPrice = fishPrice * n
    if (coin - totalPrice < 0) {
      // alertを表示する
      return
    }
    await plusCoinInStateAndDB(-totalPrice)
    await plusFishInStateAndDB(totalPrice)
    for (let i = 0; i < Math.max(2 * totalPrice - coin, 0); i++) minusCount() // カウンターに表示されている値段が所持コインを超えないように
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
        <CountBtn
          x={90}
          y={-22}
          scale={1.2}
          count={buyFishCount}
          plusHandleClick={plusCount}
          minusHandleClick={minusCount}
        />
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
            text={`x ${buyFishCount * fishPrice}`}
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
          handleClick={() => {
            BuyFish(buyFishCount)
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
