import { IAppFeatures } from './app-features.interface'
import { ICollectiblesFeatures } from './collectibles-features.interface'
import { IContactsFeatures } from './contacts-features.interface'
import { IDeveloperFeatures } from './developer-features.interface'
import { ILoginFeatures } from './login-features.interface'
import { IGovernanceFeatures } from './governance-features.interface'
import { INetworkFeatures } from './network-features.interface'
import { ISettingsFeatures } from './settings-features.interface'
import { IWalletFeatures } from './wallet-features.interface'
import { IWalletConnectFeatures } from './wallet-connect-features.interface'
import { OnboardingFeatures } from '../types/onboarding-features.type'
import { IFeatureFlag } from './feature-flag.interface'
import { ICampaignsFeatures } from './campaigns-features.interface'

export interface IFeatures {
    app: IAppFeatures
    collectibles: ICollectiblesFeatures
    contacts: IContactsFeatures
    developerTools: IDeveloperFeatures
    governance: IGovernanceFeatures
    login: ILoginFeatures
    network: INetworkFeatures
    onboarding: OnboardingFeatures
    settings: ISettingsFeatures
    wallet: IWalletFeatures
    walletConnect: IWalletConnectFeatures
    buySell: IFeatureFlag
    campaigns: ICampaignsFeatures
}
