import styled from 'styled-components'
import { HiOutlineBookOpen } from 'react-icons/hi'

const StartBtn = () => {
  const BtnBasic = styled.button`
    font-size: 1.2rem;
    font-weight: 900;
    padding: 1rem 0.8rem;
    user-select: none;
    text-align: center;
    vertical-align: middle;
    text-decoration: none;
    color: #455d55;
    background-color: #4cfcbe;
    border-radius: 1.3rem;
    border: 5px solid white;
    cursor: inherit;
  `

  const StyledHiOutlineBookOpen = styled(HiOutlineBookOpen)`
    vertical-align: top;
  `

  return (
    <BtnBasic>
      <StyledHiOutlineBookOpen size="1.8rem" /> 集中
    </BtnBasic>
  )
}

export default StartBtn
