import { IPlatform } from '@core/app/interfaces'

export * from './utils'

export const Electron: IPlatform = window['__ELECTRON__']
