import { LedgerDeviceType } from '@iota/wallet/types'
import { LedgerAppName } from '../enums'

export interface ILedgerNanoState {
    connected?: boolean
    locked?: boolean
    device?: LedgerDeviceType
    app?: LedgerAppName
    settings?: ILedgerAppSettings
    bufferSize?: number
}

interface ILedgerAppSettings {
    [LedgerAppName.Shimmer]?: ILedgerAppBaseSettings
    [LedgerAppName.Ethereum]?: ILedgerEthereumAppSettings
}

export interface ILedgerEthereumAppSettings extends ILedgerAppBaseSettings {
    erc20ProvisioningNecessary: boolean
    starkEnabled: boolean
    starkv2Supported: boolean
}

interface ILedgerAppBaseSettings {
    blindSigningEnabled: boolean
    version: string
}
