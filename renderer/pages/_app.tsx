import { AppProps } from 'next/app'

import Layout from '../components/containers/Layout'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
