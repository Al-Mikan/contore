import { Graphics, PixiRef } from '@inlet/react-pixi'
import { useCallback, forwardRef } from 'react'

type IGraphics = PixiRef<typeof Graphics>

interface Props {
  width: number
  height: number
}

const Mask = forwardRef<IGraphics, Props>(function MaskComponent(
  { width = 0, height = 0 },
  ref
) {
  const draw = useCallback(
    (g: IGraphics) => {
      g.clear()
      g.beginFill(0xffffff)
      g.drawRect(0, 0, width, height)
      g.endFill()
    },
    [width, height]
  )

  return <Graphics draw={draw} ref={ref} />
})

export default Mask
