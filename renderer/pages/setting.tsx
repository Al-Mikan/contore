import { useEffect, useState } from 'react'
import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import SettingModal from '../components/modals/SettingModal'
import Canvas from '../components/containers/Canvas'
import { useRouter } from 'next/router'

const SettingPage = () => {
  const router = useRouter()
  let [isOpen, setIsOpen] = useState(false)

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
    event.stopPropagation() // modalにクリック判定を与えない
  }

  useEffect(() => {
    window.electronAPI.setAlwaysOnTop(true)

    return () => {
      window.electronAPI.setAlwaysOnTop(false)
    }
  }, [])

  return (
    <Layout title="設定画面 | こんとれ！！">
      <Canvas>
        <SettingModal
          x={910}
          y={520}
          scale={1.5}
          handleClickToHome={handleClickToHome}
        ></SettingModal>
      </Canvas>
    </Layout>
  )
}

export default SettingPage
