import { IAnalyticsFeatures } from './interfaces/analytics-features.interface'

const analyticsFeatures: IAnalyticsFeatures = {
    enabled: true,
    appStart: {
        enabled: true,
    },
    drawerRoute: {
        enabled: true,
        contactBook: {
            enabled: true,
        },
        dappConfig: {
            enabled: true,
        },
        networkConfig: {
            enabled: true,
        },
    },
    dashboardRoute: {
        enabled: true,
        collectibles: {
            enabled: true,
        },
        developer: {
            enabled: true,
        },
        governance: {
            enabled: true,
        },
        settings: {
            enabled: true,
        },
        wallet: {
            enabled: true,
            sendFlow: {
                enabled: true,
            },
        },
    },
    loginRoute: {
        enabled: true,
    },
    onboardingRoute: {
        enabled: true,
    },
    updateStrongholdRoute: {
        enabled: true,
    },
}

export default analyticsFeatures
