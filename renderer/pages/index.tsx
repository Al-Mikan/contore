import { useRouter } from 'next/router'

import Layout from '../components/containers/Layout'
import Home from '../components/use-contexts/Home'

const IndexPage = () => {
  const router = useRouter()

  return (
    <Layout title="Home | こんとれ！！">
      <Home router={router} />
    </Layout>
  )
}

export default IndexPage
