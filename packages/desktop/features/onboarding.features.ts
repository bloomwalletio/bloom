import { IOnboardingFeaturesForNetwork } from '@lib/features/interfaces'
import { OnboardingFeatures } from '@lib/features/types'

const onboardingFeaturesForShimmer: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: true,
        hidden: false,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
}

const onboardingFeaturesForTestnet: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: true,
        hidden: false,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
}

const onboardingFeaturesForCustom: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: true,
        hidden: false,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
}

const onboardingFeatures: OnboardingFeatures = {
    enabled: true,
    shimmer: onboardingFeaturesForShimmer,
    testnet: onboardingFeaturesForTestnet,
    custom: onboardingFeaturesForCustom,
    strongholdVersionCheck: {
        enabled: true,
    },
}

export default onboardingFeatures
