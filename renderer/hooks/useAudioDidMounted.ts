import { useEffect } from 'react'

// audioタグはReact管理外なので、状態はページ間で共有される
const useAudioDidMounted = (soundPath: string) => {
  useEffect(() => {
    const audioElement = document.getElementById('game-audio') as
      | HTMLAudioElement
      | null
      | undefined
    if (!audioElement) return
    // 初回読み込み。srcを変えると最初からスタートになる
    if (audioElement.paused && audioElement.currentTime === 0) {
      audioElement.src = soundPath
      audioElement.volume = 0.02
      audioElement.loop = true
    }

    audioElement.play()

    return () => {
      audioElement.pause()
    }
  }, [])
}

export default useAudioDidMounted
