import { IFeatureFlag } from './feature-flag.interface'

export interface IWalletConnectFeatures extends IFeatureFlag {
    web3Wallet: IFeatureFlag
    notifications: IFeatureFlag
}
