import { LedgerDeviceType } from '@iota/sdk/out/types'
import { LedgerAppName } from '../enums'
import { ILedgerAppSettings } from './app-settings'

export interface ILedgerDeviceState {
    connected?: boolean
    locked?: boolean
    device?: LedgerDeviceType
    app?: LedgerAppName
    settings?: ILedgerAppSettings
    bufferSize?: number
}
