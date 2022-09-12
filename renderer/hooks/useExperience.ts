import { useEffect, useState } from 'react'

import ExperiencePoint from '../utils/ExperiencePoint'
import { shouldFetchExperience, updateCoreEX } from '../utils/model'

const useExperience = (): [number, (n: number) => Promise<void>] => {
  const [experience, setExperience] = useState(-1)
  const plusExInStateAndDB = async (n: number) => {
    setExperience((prev) => {
      const ex = new ExperiencePoint(prev)
      ex.add_point(n)
      updateCoreEX(ex.experience_point)
      return ex.experience_point // TODO: DBの更新を終えてからStateの更新をする
    })
  }

  useEffect(() => {
    const fetchExperience = async () => {
      setExperience(await shouldFetchExperience())
    }
    fetchExperience()
  }, [])

  return [experience, plusExInStateAndDB]
}

export default useExperience
