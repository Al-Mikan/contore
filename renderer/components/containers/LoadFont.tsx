import { Container, useApp } from '@inlet/react-pixi'
import { ReactNode, useEffect, useState } from 'react'
import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

type Props = {
  children: ReactNode
}

const LoadFont = ({ children }: Props) => {
  const app = useApp()
  const [isFontLoaded, setIsFontLoaded] = useState(false)
  useEffect(() => {
    Loader.registerPlugin(WebfontLoaderPlugin)
    app.loader.add({ name: 'neue-pixel-sans', url: '/fonts/NeuePixelSans.ttf' })
    app.loader.load(() => {
      setIsFontLoaded(true)
    })
  }, [])
  if (isFontLoaded) {
    return <Container>{children}</Container>
  } else {
    return <Container></Container>
  }
}

export default LoadFont
