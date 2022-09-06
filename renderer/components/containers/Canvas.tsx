import styled from 'styled-components'
import { Stage } from '@inlet/react-pixi'
import { ReactNode } from 'react'

import LoadFont from './LoadFont'

type Props = {
  children: ReactNode
}

const Canvas = ({ children }: Props) => {
  return (
    <StyledStage height={1080} width={1920} options={{ backgroundAlpha: 0 }}>
      <LoadFont>{children}</LoadFont>
    </StyledStage>
  )
}

const StyledStage = styled(Stage)`
  width: 100% !important;
  height: 100% !important;
`

export default Canvas
