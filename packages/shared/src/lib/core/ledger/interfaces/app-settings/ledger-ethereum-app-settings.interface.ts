import { IBaseLedgerAppSettings } from './base-ledger-app-settings.interface'

export interface ILedgerEthereumAppSettings extends IBaseLedgerAppSettings {
    erc20ProvisioningNecessary: boolean
    starkEnabled: boolean
    starkv2Supported: boolean
}
