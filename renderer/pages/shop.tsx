import { InteractionEvent } from 'pixi.js'

import Layout from '../containers/Layout'
import ShopModal from './ShopModal'
import { useRouter } from 'next/router'

const ShopPage = () => {
  const router = useRouter()

  const handleClickToHome = (event: InteractionEvent) => {
    router.push('/')
  }

  return (
    <Layout title="ショップ | こんとれ！！">
      <ShopModal
        x={910}
        y={520}
        scale={1.5}
        handleClickToHome={handleClickToHome}
      ></ShopModal>
    </Layout>
  )
}

export default ShopPage
