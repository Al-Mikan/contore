import Layout from '../components/Layout'
import StartBtn from '../components/StartBtn'
import getScore from '../utils/Score'


const IndexPage = () => {
  return (
    <Layout title="Home | こんとれ！！">
      <h1 onClick={handle}>はろーこんとれ</h1>
    </Layout>
  )
}

const handle = () =>{
  const sendcamera = (window as any).banana.sendcamera
  sendcamera('hello')
}
export default IndexPage
