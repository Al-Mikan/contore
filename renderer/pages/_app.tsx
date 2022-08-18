import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
