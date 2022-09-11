import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import Layout from '../components/containers/Layout'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}
