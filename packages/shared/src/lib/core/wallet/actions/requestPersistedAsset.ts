import { getErc20TokenMetadata } from '@core/layer-2/utils'
import { validateEthereumAddress } from '@core/utils/crypto/utils'
import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { buildPersistedAssetFromMetadata } from '../helpers'
import { IErc20Metadata, IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { AssetVerification } from '../types'
import { getIrc30MetadataFromFoundryOutput } from '../utils'
import { activeAccounts } from '@core/profile/stores'
import { get } from 'svelte/store'
import { network } from '@core/network/stores'

export async function requestPersistedAsset(tokenId: string, chainId?: number): Promise<IPersistedAsset | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (chainId) {
        try {
            validateEthereumAddress(tokenId)
            tokenMetadata = await getErc20TokenMetadata(tokenId, chainId, get(network))
        } catch {
            // do nothing
        }
    } else {
        const account = get(activeAccounts)?.[0]
        if (account) {
            tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId, account)
        }
    }
    if (tokenMetadata) {
        const verification: AssetVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromMetadata(tokenId, tokenMetadata, verification)
        return persistedAsset
    }
}
