import React, { ReactNode } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'こんとれ！！' }: Props) => (
  <StyledConteiner>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </StyledConteiner>
)

const StyledConteiner = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url('/img/background.png');
  background-size: 100% 100%;
  overflow: hidden;
  color: white;
  position: relative;
  cursor: url('/img/pad.png') 15 15, auto;
`

export default Layout
