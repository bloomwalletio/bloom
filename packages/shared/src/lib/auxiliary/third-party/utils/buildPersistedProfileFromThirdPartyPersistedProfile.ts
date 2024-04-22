import { IPersistedAccountData } from '@core/account'
import { APP_STAGE } from '@core/app'
import { MarketCurrency } from '@core/market'
import {
    DEFAULT_ISC_CHAINS_CONFIGURATIONS,
    IStardustNetworkMetadata,
    NetworkNamespace,
    StardustNetworkId,
} from '@core/network'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { DownloadPermission } from '@core/nfts/enums'
import {
    DEFAULT_IPFS_GATEWAYS,
    DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
    IPersistedProfile,
    IProfileSettings,
    PROFILE_VERSION,
} from '@core/profile'
import { DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES } from '@core/profile/constants/default-lock-screen-timeout-in-minutes.constant'
import { StrongholdVersion } from '@core/stronghold'
import { NETWORK_NAME_TO_STARDUST_NETWORK_ID_MAP } from '../constants/network-name-to-stardust-network-id-map.constant'
import { ThirdPartyAppName } from '../enums'
import {
    IThirdPartyPersistedAccountData,
    IThirdPartyPersistedNetwork,
    IThirdPartyPersistedProfile,
    IThirdPartyPersistedSettings,
} from '../interfaces'

export function buildPersistedProfileFromThirdPartyPersistedProfile(
    thirdPartyProfile: IThirdPartyPersistedProfile,
    appName: ThirdPartyAppName
): IPersistedProfile | undefined {
    if (!thirdPartyProfile || thirdPartyProfile.needsChrysalisToStardustDbMigration) {
        return undefined
    }

    const persistedProfile: IPersistedProfile = {
        id: thirdPartyProfile.id,
        versionTrack: APP_STAGE,
        version: PROFILE_VERSION.prod,
        name: thirdPartyProfile.name,
        type: thirdPartyProfile.type,
        network: buildStardustNetworkFromThirdPartyPersistedNetwork(thirdPartyProfile.network),
        lastStrongholdBackupTime: thirdPartyProfile.lastStrongholdBackupTime ?? new Date(),
        settings: buildSettingsFromThirdPartyPersistedSettings(thirdPartyProfile.settings),
        accountPersistedData: buildPersistedAccountDataFromThirdPartyPersistedAccountData(
            thirdPartyProfile.accountPersistedData
        ),
        contacts: {},
        networkContactAddresses: {},
        features: {
            wallet: true,
            collectibles: true,
            campaigns: true,
            governance: true,
            buySell: true,
            developer: thirdPartyProfile.isDeveloperProfile,
            settings: true,
        },
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

function buildStardustNetworkFromThirdPartyPersistedNetwork(
    network: IThirdPartyPersistedNetwork
): IStardustNetworkMetadata {
    const networkId: StardustNetworkId =
        NETWORK_NAME_TO_STARDUST_NETWORK_ID_MAP[network.protocol.networkName] ??
        `${NetworkNamespace.Stardust}:${network.protocol.networkName}`
    const defaultChainConfigurations = structuredClone(DEFAULT_ISC_CHAINS_CONFIGURATIONS?.[networkId])

    return {
        id: networkId,
        name: network.name,
        namespace: NetworkNamespace.Stardust,
        coinType: network.coinType,
        protocol: network.protocol,
        baseToken: network.baseToken,
        chainConfigurations: defaultChainConfigurations ? [defaultChainConfigurations] : [],
    }
}

function buildSettingsFromThirdPartyPersistedSettings(settings: IThirdPartyPersistedSettings): IProfileSettings {
    return {
        marketCurrency: settings.marketCurrency ?? MarketCurrency.Usd,
        lockScreenTimeoutInMinutes: settings.lockScreenTimeoutInMinutes ?? DEFAULT_LOCK_SCREEN_TIMEOUT_IN_MINUTES,
        strongholdPasswordTimeoutInMinutes:
            settings.strongholdPasswordTimeoutInMinutes ?? DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        nfts: {
            ipfsGateways: DEFAULT_IPFS_GATEWAYS,
            downloadPermissions: DownloadPermission.AllowListOnly,
            maxMediaSizeInMegaBytes: settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
            maxMediaDownloadTimeInSeconds:
                settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
        },
        hideNetworkStatistics: settings.hideNetworkStatistics,
    }
}

function buildPersistedAccountDataFromThirdPartyPersistedAccountData(thirdPartyAccountData: {
    [accountId: string]: IThirdPartyPersistedAccountData
}): { [accountId: string]: IPersistedAccountData } {
    const persistedAccountData: { [accountId: string]: IPersistedAccountData } = {}
    for (const accountId in thirdPartyAccountData) {
        const thirdPartyAccountDataItem = thirdPartyAccountData[accountId]
        const persistedAccountDataItem: IPersistedAccountData = {
            name: thirdPartyAccountDataItem.name,
            color: thirdPartyAccountDataItem.color,
            hidden: thirdPartyAccountDataItem.hidden,
            shouldRevote: thirdPartyAccountDataItem.shouldRevote,
            removedProposalIds: thirdPartyAccountDataItem.removedProposalIds,
            evmAddresses: {},
            depositAddress: '', // TODO: Add deposit address during login
            otherAddresses: thirdPartyAccountDataItem.knownAddresses?.map((address) => address.address) ?? [],
        }
        persistedAccountData[accountId] = persistedAccountDataItem
    }
    return persistedAccountData
}
