import { LedgerDeviceType } from '@iota/wallet/types'
import { LedgerAppName } from '../enums'
import { ILedgerAppSettings } from './ledger-app-settings.interface'

export interface ILedgerDeviceState {
    connected?: boolean
    locked?: boolean
    device?: LedgerDeviceType
    app?: LedgerAppName
    settings?: ILedgerAppSettings
    bufferSize?: number
}
