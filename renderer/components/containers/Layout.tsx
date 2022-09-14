import { RouterContext } from 'next/dist/shared/lib/router-context'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

import Canvas from './Canvas'
import CanvasContext from './CanvasContext'
import ContextBridge from './ContextBridge'
import LoadFont from './LoadFont'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => (
  <StyledConteiner>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <ContextBridge
      Context={RouterContext}
      render={(renderchildren) => <Canvas>{renderchildren}</Canvas>}
    >
      <CanvasContext>
        <LoadFont>{children}</LoadFont>
      </CanvasContext>
    </ContextBridge>
    {/* TODO: 直コンポーネントをまとめる */}
    <video
      id="video"
      style={{ visibility: 'hidden', width: '0px', height: '0px' }}
    />
    <canvas
      id="canvas"
      width="1280px"
      height="720px"
      style={{ zIndex: '100' }}
    />
  </StyledConteiner>
)

const StyledConteiner = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  /* 動作不安定のためoff */
  /* cursor: url('/static/img/mini-pad.png') 15 15, auto; */
`

export default Layout
