import analyticsFeatures from './analytics.features'
import appFeatures from './app.features'
import buySellFeatures from './buy-sell.features'
import campaignsFeatures from './campaigns.features'
import collectiblesFeatures from './collectibles.features'
import contactsFeatures from './contacts.features'
import developerToolsFeatures from './developer-tools.features'
import electronFeatures from './electron.features'
import governanceFeatures from './governance.features'
import { IDesktopFeatures } from './interfaces'
import loginFeatures from './login.features'
import networkFeatures from './network.features'
import onboardingFeatures from './onboarding.features'
import settingsFeatures from './settings.features'
import walletConnectFeatures from './wallet-connect.features'
import walletFeatures from './wallet.features'

const features: IDesktopFeatures = {
    app: appFeatures,
    analytics: analyticsFeatures,
    collectibles: collectiblesFeatures,
    contacts: contactsFeatures,
    developerTools: developerToolsFeatures,
    electron: electronFeatures,
    governance: governanceFeatures,
    login: loginFeatures,
    network: networkFeatures,
    onboarding: onboardingFeatures,
    settings: settingsFeatures,
    wallet: walletFeatures,
    walletConnect: walletConnectFeatures,
    buySell: buySellFeatures,
    campaigns: campaignsFeatures,
}

export default features
