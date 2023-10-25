import { IFeatureFlag } from '@lib/features/interfaces'

export interface IAnalyticsFeatures extends IFeatureFlag {
    appStart: IFeatureFlag
    drawerRoute: {
        contactBook: IFeatureFlag
        dappConfig: IFeatureFlag
        networkConfig: IFeatureFlag
    }
    dashboardRoute: IFeatureFlag & {
        collectibles: IFeatureFlag
        governance: IFeatureFlag
        settings: IFeatureFlag
        wallet: {
            sendFlow: IFeatureFlag
        }
    }
    loginRoute: IFeatureFlag
    onboardingRoute: IFeatureFlag
    updateStrongholdRoute: IFeatureFlag
}
