import { persistedDappNamespaces } from '@auxiliary/wallet-connect/stores'
import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { DownloadPermission } from '@core/nfts/enums'
import { DEFAULT_IPFS_GATEWAYS } from '@core/profile/constants'
import { IPersistedProfile } from '@core/profile/interfaces'
import { ProposalTypes } from '@walletconnect/types'

type OldPersistedNamespaces = {
    [dappOriginUrl: string]: SupportedNamespaces
}

type NewPersistedNamespaces = {
    [dappOriginUrl: string]: {
        supported: SupportedNamespaces
        required: ProposalTypes.RequiredNamespaces
        optional: ProposalTypes.OptionalNamespaces
    }
}

export function prodProfileMigration6To7(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        settings: { maxMediaSizeInMegaBytes?: number; maxMediaDownloadTimeInSeconds?: number }
    }
    profile.settings.nfts = {
        ipfsGateways: DEFAULT_IPFS_GATEWAYS,
        downloadPermissions: DownloadPermission.AllowListOnly,
        maxMediaSizeInMegaBytes: profile.settings.maxMediaSizeInMegaBytes ?? DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds:
            profile.settings.maxMediaDownloadTimeInSeconds ?? DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }
    delete profile.settings.maxMediaSizeInMegaBytes
    delete profile.settings.maxMediaDownloadTimeInSeconds

    persistedDappNamespaces.update((state) => {
        const profileId = profile.id
        if (!state[profileId]) {
            state[profileId] = {}
            return state
        }
        const persistedNamespaces = state[profileId] as unknown as OldPersistedNamespaces

        const newPersistedNamespaces = Object.entries(persistedNamespaces).reduce((acc, [dappOriginUrl, supported]) => {
            acc[dappOriginUrl] = { supported, required: {}, optional: {} }
            return acc
        }, {} as NewPersistedNamespaces)

        state[profileId] = newPersistedNamespaces
        return state
    })
    return Promise.resolve()
}
