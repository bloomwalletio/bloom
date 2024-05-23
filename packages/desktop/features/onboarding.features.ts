import { IOnboardingFeaturesForNetwork } from '@lib/features/interfaces'
import { OnboardingFeatures } from '@lib/features/types'

const onboardingFeaturesForIota: IOnboardingFeaturesForNetwork = {
    enabled: true,
    hidden: false,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
            skipVerification: {
                enabled: false,
            },
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
        enabled: false,
        hidden: true,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
    defaultIscChains: {
        enabled: false,
    },
    defaultEvmChains: {
        enabled: false,
    },
}

const onboardingFeaturesForShimmer: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
            skipVerification: {
                enabled: false,
            },
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
    defaultIscChains: {
        enabled: true,
    },
    defaultEvmChains: {
        enabled: false,
    },
}

const onboardingFeaturesForIotaTestnet: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
            skipVerification: {
                enabled: false,
            },
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
        hidden: true,
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
    defaultIscChains: {
        enabled: true,
    },
    defaultEvmChains: {
        enabled: false,
    },
}

const onboardingFeaturesForTestnet: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
            skipVerification: {
                enabled: false,
            },
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
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
    defaultIscChains: {
        enabled: true,
    },
    defaultEvmChains: {
        enabled: false,
    },
}

const onboardingFeaturesForCustom: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
            skipVerification: {
                enabled: false,
            },
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
    defaultIscChains: {
        enabled: true,
    },
    defaultEvmChains: {
        enabled: false,
    },
}

const onboardingFeatures: OnboardingFeatures = {
    enabled: true,
    iota: onboardingFeaturesForIota,
    shimmer: onboardingFeaturesForShimmer,
    iotaTestnet: onboardingFeaturesForIotaTestnet,
    testnet: onboardingFeaturesForTestnet,
    custom: onboardingFeaturesForCustom,
    importFromThirdParty: {
        enabled: true,
    },
    strongholdVersionCheck: {
        enabled: true,
    },
    confetti: {
        enabled: false,
    },
}

export default onboardingFeatures
