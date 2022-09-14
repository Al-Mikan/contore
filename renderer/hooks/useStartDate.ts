import { useEffect, useState } from 'react'

import { shouldFetchStartDate, updateCoreStartDate } from '../utils/model'

const useStartDate = (): [string, (s: string) => Promise<void>] => {
  const [startDate, setStartDate] = useState('')
  const setStartDateInStateAndDB = async (s: string) => {
    await updateCoreStartDate(s)
    setStartDate(s)
  }

  useEffect(() => {
    const fetchStartDate = async () => {
      setStartDate(await shouldFetchStartDate())
    }
    fetchStartDate()
  }, [])

  return [startDate, setStartDateInStateAndDB]
}

export default useStartDate
