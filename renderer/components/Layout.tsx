import React, { ReactNode } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'こんとれ！！' }: Props) => (
  <BackgroundImage>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </BackgroundImage>
)

const BackgroundImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url('/images/forest.jpg');
  background-size: cover;
`

export default Layout
