import { InteractionEvent } from 'pixi.js'

import Layout from '../components/containers/Layout'
import ShopModal from '../components/modals/ShopModal'
import { useRouter } from 'next/router'

const SettingPage = () => {
  const router = useRouter()

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
  }

  return (
    <Layout title="設定画面 | こんとれ！！">
      <ShopModal
        x={910}
        y={520}
        scale={1.5}
        handleClickToHome={handleClickToHome}
      ></ShopModal>
    </Layout>
  )
}

export default SettingPage
