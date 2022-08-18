import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react'

interface Props {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  time: string
}

const ResultModal = ({ isOpen, onOpen, onClose, time }: Props) => {
  const router = useRouter()
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    router.push('/')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>結果発表</ModalHeader>
        <ModalBody>
          <p>{time}</p>
          <p>集中しました！</p>
          <p>集中度　86点</p>
          <p>姿勢　90点</p>
          <p>coin 180</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClick}>
            戻る
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ResultModal
