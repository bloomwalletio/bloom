import { LedgerAppName } from '../../enums'
import { ILedgerEthereumAppSettings } from './ledger-ethereum-app-settings.interface'
import { IBaseLedgerAppSettings } from './base-ledger-app-settings.interface'

export interface ILedgerAppSettings {
    [LedgerAppName.Shimmer]?: IBaseLedgerAppSettings
    [LedgerAppName.Ethereum]?: ILedgerEthereumAppSettings
}
