import { InteractionEvent } from 'pixi.js'

import Layout from '../containers/Layout'
import SettingModal from './SettingModal'
import { useRouter } from 'next/router'

const SettingPage = () => {
  const router = useRouter()

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
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
