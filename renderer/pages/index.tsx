import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'
import getScore from '../utils/Score'

const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <h1>{getScore()}</h1>
      <StartBtn></StartBtn>
    </Layout>
  )
}

export default IndexPage
