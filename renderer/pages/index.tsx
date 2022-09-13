import { Container } from '@inlet/react-pixi'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import FeedBtn from '../components/buttons/FeedBtn'
import OptionBtn from '../components/buttons/OptionBtn'
import ShopBtn from '../components/buttons/ShopBtn'
import StartBtn from '../components/buttons/StartBtn'
import MiniCat from '../components/characters/MiniCat'
import { GameContext } from '../components/containers/CanvasContext'
import BackGround from '../components/items/BackGround'
import BlackOverlay from '../components/items/BlackOverlay'
import Board from '../components/items/CorkBoard'
import StatusBox from '../components/items/StatusBox'
import TitleBar from '../components/items/TitleBar'
import ReceiveCatModal from '../components/modals/ReceiveCatModal'
import SettingModal from '../components/modals/SettingModal'
import ShopModal from '../components/modals/ShopModal'
import { Position } from '../types/character'
import { getNowYMDhmsStr } from '../utils/common'

const IndexPage = () => {
  const router = useRouter()
  const { startDate, setStartDateInStateAndDB } = useContext(GameContext)
  const [windowPosition, setWindowPosition] = useState<Position>({
    x: 350,
    y: 200,
  })
  const [minicatScale, setMinicatScale] = useState(0.7)
  const [openingModalName, setOpeningModalName] = useState('')

  // 背景画像のサイズを元に調整する
  // 1600 × 900
  const miniCatBorder = {
    minX: 0 + 20,
    maxX: 1600 - 20,
    minY: 20 + (minicatScale - 0.5) * 45, // スケール調整時に浮かないように
    maxY: 900 - 70 - (minicatScale - 0.5) * 45,
    randomTargetMinX: 0 + 20,
    randomTargetMaxX: 900 - 20,
  }

  useEffect(() => {
    if (startDate === 'default') {
      setOpeningModalName('receive-cat')
      setStartDateInStateAndDB(getNowYMDhmsStr())
    }
  }, [])

  return (
    <Container x={windowPosition.x} y={windowPosition.y} scale={0.85}>
      <TitleBar
        y={-40}
        setPositionHook={(pos: Position) => {
          setWindowPosition(pos)
        }}
      />
      <BackGround>
        <StatusBox x={1170} y={180} />
        <Board x={50} scale={0.8} />
        <OptionBtn
          handleClick={() => setOpeningModalName('setting')}
          x={60}
          y={782}
          scale={0.6}
        />
        <StartBtn
          handleClick={() => router.push('/concentrate')}
          x={1250}
          y={737}
          scale={2.3}
        />
        <FeedBtn
          handleClick={() => router.push('/feed')}
          x={1050}
          y={770}
          scale={0.75}
        />
        <ShopBtn
          handleClick={() => setOpeningModalName('shop')}
          x={860}
          y={770}
          scale={0.73}
        />
        <MiniCat
          defaultX={200}
          defaultY={miniCatBorder.maxY}
          scale={minicatScale}
          border={miniCatBorder}
        />
      </BackGround>

      {openingModalName !== '' && (
        <BlackOverlay>
          {openingModalName === 'shop' && (
            <ShopModal
              x={800}
              y={400}
              scale={1.2}
              handleCloseClcik={() => setOpeningModalName('')}
            />
          )}
          {openingModalName === 'setting' && (
            <SettingModal
              x={800}
              y={400}
              scale={1.2}
              handleCloseClcik={() => setOpeningModalName('')}
            />
          )}
          {openingModalName === 'receive-cat' && (
            <ReceiveCatModal
              x={800}
              y={400}
              scale={1.8}
              handleCloseClcik={() => setOpeningModalName('')}
            />
          )}
        </BlackOverlay>
      )}
    </Container>
  )
}

export default IndexPage
