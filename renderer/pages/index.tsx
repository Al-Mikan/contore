import Layout from '../components/Layout'
import Link from 'next/link'

const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <h1>はろー こんとれ！！</h1>
      <Link href="/concentrate">
        <a>集中開始</a>
      </Link>
    </Layout>
  )
}

export default IndexPage
