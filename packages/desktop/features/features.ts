import collectiblesFeatures from './collectibles.features'
import contactsFeatures from './contacts.features'
import developerToolsFeatures from './developer-tools.features'
import electronFeatures from './electron.features'
import governanceFeatures from './governance.features'
import loginFeatures from './login.features'
import networkFeatures from './network.features'
import onboardingFeatures from './onboarding.features'
import settingsFeatures from './settings.features'
import walletFeatures from './wallet.features'
import analyticsFeatures from './analytics.features'
import { IDesktopFeatures } from './interfaces'

const features: IDesktopFeatures = {
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
    analytics: analyticsFeatures,
}

export default features
