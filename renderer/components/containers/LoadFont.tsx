import { Container, useApp } from '@inlet/react-pixi'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'
import { Loader } from 'pixi.js'
import { ReactNode, useEffect, useState } from 'react'

type Props = {
  children: ReactNode
}

const LoadFont = ({ children }: Props) => {
  const app = useApp()
  const [isFontLoaded, setIsFontLoaded] = useState(false)
  useEffect(() => {
    Loader.registerPlugin(WebfontLoaderPlugin)
    Loader.shared.add({
      name: 'neue-pixel-sans',
      url: '/static/fonts/NeuePixelSans.ttf',
    })
    Loader.shared.add({
      name: 'dot-gothic16',
      url: '/static/fonts/DotGothic16.ttf',
    })
    Loader.shared.load(() => {
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
