import { Setting } from '../types/other'

export const shouldFetchSetting = async () => {
  const nowSetting: Setting = await window.database.read('setting')
  if (nowSetting === undefined) {
    throw new Error('electron-store: settingが存在しません')
  }
  return nowSetting
}

export const shouldFetchCoins = async () => {
  // コイン枚数の設定
  const nowCoins: number = await window.database.read('core.coin')
  if (nowCoins === undefined) {
    throw new Error('electron-store: core.coinが存在しません')
  }
  return nowCoins
}

export const shouldFetchFish = async () => {
  const nowFish: number = await window.database.read('shop.fish')
  if (nowFish === undefined) {
    throw new Error('electron-store: shop.fishが存在しません')
  }
  return nowFish
}

export const shouldFetchExperience = async () => {
  // 経験値の設定
  const nowEx: number = await window.database.read('core.experience_point')
  if (nowEx === undefined) {
    throw new Error('electron-store: core.experience_pointが存在しません')
  }
  return nowEx
}
