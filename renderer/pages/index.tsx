import Layout from '../components/Layout'
import Link from 'next/link'
import styled from 'styled-components'

const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <Container>
        <h1>はろー こんとれ！！</h1>
        <Link href="/concentrate">
          <a>集中開始</a>
        </Link>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  width: 100vw;
  height: 100vh;
`

export default IndexPage
