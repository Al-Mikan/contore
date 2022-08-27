import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react'
import { Sprite } from '@inlet/react-pixi'

interface Props {
  time: string
}

const ResultModal = ({ time }: Props) => {
  const router = useRouter()
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    router.push('/')
  }

  return <Sprite></Sprite>
}

export default ResultModal
