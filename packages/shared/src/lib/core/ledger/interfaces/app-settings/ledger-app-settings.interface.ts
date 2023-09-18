import { LedgerAppName } from '../../enums'
import { IBaseLedgerAppSettings } from './base-ledger-app-settings.interface'
import { ILedgerEthereumAppSettings } from './ledger-ethereum-app-settings.interface'

export interface ILedgerAppSettings {
    [LedgerAppName.Shimmer]?: IBaseLedgerAppSettings
    [LedgerAppName.Ethereum]?: ILedgerEthereumAppSettings
}
