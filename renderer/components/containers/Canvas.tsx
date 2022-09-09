import styled from 'styled-components'
import { Stage } from '@inlet/react-pixi'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'

import LoadFont from './LoadFont'
import CanvasContext from './CanvasContext'

type Props = {
  children: ReactNode
}

const Canvas = ({ children }: Props) => {
  // Context Briegeのためrouterを渡す
  const router = useRouter()
  return (
    <StyledStage height={1080} width={1920} options={{ backgroundAlpha: 0 }}>
      <CanvasContext router={router}>
        <LoadFont>{children}</LoadFont>
      </CanvasContext>
    </StyledStage>
  )
}

const StyledStage = styled(Stage)`
  width: 100% !important;
  height: 100% !important;
`

export default Canvas
