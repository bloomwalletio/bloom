export interface IGetEthereumAppSettingsResponse {
    version: string
    arbitraryDataEnabled: boolean
    erc20ProvisioningNecessary: boolean
    starkEnabled: boolean
    starkv2Supported: boolean
}
