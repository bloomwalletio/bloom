import { MarketCurrency } from '@core/market'
import { NetworkNamespace } from '@core/network'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts'
import { DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES, IPersistedProfile, PROFILE_VERSION } from '@core/profile'
import { DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES } from '@core/profile/constants/default-lock-screen-timeout-in-minutes.constant'
import { StrongholdVersion } from '@core/stronghold'
import { IThirdPartyPersistedProfile } from '../interfaces'
import { buildPersistedAccountDataFromThirdPartyPersistedAccountData } from './buildPersistedAccountDataFromThirdPartyPersistedAccountData'
import { ThirdPartyAppName } from '../enums'

export function buildPersistedProfileFromThirdPartyPersistedProfile(
    thirdPartyProfile: IThirdPartyPersistedProfile,
    appName: ThirdPartyAppName
): IPersistedProfile | undefined {
    if (!thirdPartyProfile || thirdPartyProfile.needsChrysalisToStardustDbMigration) {
        return undefined
    }
    const persistedProfile: IPersistedProfile = {
        id: thirdPartyProfile.id,
        version: PROFILE_VERSION.prod,
        name: thirdPartyProfile.name,
        type: thirdPartyProfile.type,
        network: {
            id: `${NetworkNamespace.Stardust}:${thirdPartyProfile.network.protocol.networkName}`,
            name: thirdPartyProfile.network.name,
            namespace: NetworkNamespace.Stardust,
            networkName: thirdPartyProfile.network.protocol.networkName,
            coinType: thirdPartyProfile.network.coinType,
            protocol: thirdPartyProfile.network.protocol,
            baseToken: thirdPartyProfile.network.baseToken,
            chainConfigurations: [],
        },
        lastStrongholdBackupTime: thirdPartyProfile.lastStrongholdBackupTime ?? new Date(),
        settings: {
            marketCurrency: thirdPartyProfile.settings.marketCurrency ?? MarketCurrency.Usd,
            lockScreenTimeoutInMinutes:
                thirdPartyProfile.settings.lockScreenTimeoutInMinutes ?? DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES,
            strongholdPasswordTimeoutInMinutes:
                thirdPartyProfile.settings.strongholdPasswordTimeoutInMinutes ??
                DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
            maxMediaSizeInMegaBytes:
                thirdPartyProfile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
            maxMediaDownloadTimeInSeconds:
                thirdPartyProfile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
            hideNetworkStatistics: thirdPartyProfile.settings.hideNetworkStatistics,
        },
        accountPersistedData: buildPersistedAccountDataFromThirdPartyPersistedAccountData(
            thirdPartyProfile.accountPersistedData
        ),
        contacts: {},
        networkContactAddresses: {},
        isDeveloperProfile: thirdPartyProfile.isDeveloperProfile,
        hasVisitedDashboard: thirdPartyProfile.hasVisitedDashboard,
        lastUsedAccountIndex: thirdPartyProfile.lastUsedAccountIndex,
        clientOptions: thirdPartyProfile.clientOptions,
        forceAssetRefresh: false,
        strongholdVersion: thirdPartyProfile.strongholdVersion ?? StrongholdVersion.V2,
        trackedNfts: {},
        trackedTokens: {},
        pincodeLocation: appName,
    }

    return persistedProfile
}
