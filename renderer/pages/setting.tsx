import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import SettingModal from '../components/modals/SettingModal'
import { useRouter } from 'next/router'

const SettingPage = () => {
  const router = useRouter()

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
    event.stopPropagation() // modalにクリック判定を与えない
  }

  return (
    <Layout title="設定画面 | こんとれ！！">
      <SettingModal
        x={910}
        y={520}
        scale={1.5}
        handleClickToHome={handleClickToHome}
      ></SettingModal>
    </Layout>
  )
}

export default SettingPage
