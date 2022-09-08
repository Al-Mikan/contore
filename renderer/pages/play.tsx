import { useRouter } from 'next/router'

import Layout from '../components/containers/Layout'
import UseContextPlay from '../components/use-contexts/Play'

const Play = () => {
  const router = useRouter()

  return (
    <Layout title="鑑賞モード | こんとれ！！">
      <UseContextPlay router={router} />
    </Layout>
  )
}

export default Play
