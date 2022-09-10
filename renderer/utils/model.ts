import { Setting } from '../types/other'

export const shouldFetchSetting = async () => {
  const nowSetting: Setting = await window.database.read('setting')
  if (nowSetting === undefined) {
    throw new Error('electron-store: settingが存在しません')
  }
  return nowSetting
}

export const shouldFetchCoins = async () => {
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
  const nowEx: number = await window.database.read('core.experience_point')
  if (nowEx === undefined) {
    throw new Error('electron-store: core.experience_pointが存在しません')
  }
  return nowEx
}

export const shouldFetchHP = async () => {
  const nowHP: number = await window.database.read('core.health_point')
  if (nowHP === undefined) {
    throw new Error('electron-store: core.health_pointが存在しません')
  }
  return nowHP
}

export const shouldFetchLastLogin = async () => {
  const lastLogin: string = await window.database.read('core.last_login')
  if (lastLogin === undefined) {
    throw new Error('electron-store: core.last_loginが存在しません')
  }
  return lastLogin
}

export const updateSettingCamera = async (settingCamera: boolean) => {
  await window.database.update('setting.camera', settingCamera)
}

export const updateSettingDrag = async (settingDrag: boolean) => {
  await window.database.update('setting.drag', settingDrag)
}

export const updateCoreCoin = async (coreCoin: number) => {
  await window.database.update('core.coin', coreCoin)
}

export const updateShopFish = async (shopFish: number) => {
  await window.database.update('shop.fish', shopFish)
}

export const updateCoreEX = async (experiencePoint: number) => {
  await window.database.update('core.experience_point', experiencePoint)
}

export const updateCoreHP = async (healthPoint: number) => {
  await window.database.update('core.health_point', healthPoint)
}

export const updateCoreLastLogin = async (lastLogin: string) => {
  await window.database.update('core.last_login', lastLogin)
}
