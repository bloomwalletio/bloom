import { get } from 'svelte/store'

import { validateEthereumAddress } from '@core/utils/crypto/utils'
import { getIrc30MetadataFromFoundryOutput } from '@core/wallet/utils/getIrc30MetadataFromFoundryOutput'
import { getErc20TokenMetadata } from '@core/layer-2/utils/getErc20TokenMetadata'
import { activeAccounts } from '@core/profile/stores'
import { network } from '@core/network/stores'
import type { INetwork } from '@core/network/interfaces'

import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IErc20Metadata, IIrc30Metadata, IPersistedToken } from '../interfaces'
import { TokenVerification } from '../types'
import { buildPersistedTokenFromMetadata } from '../utils'
import { NetworkId } from '@core/network/types'
import { isEvmChain, isStardustNetwork } from '@core/network'

export async function requestPersistedToken(
    tokenId: string,
    networkId: NetworkId
): Promise<IPersistedToken | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (networkId && isEvmChain(networkId)) {
        try {
            validateEthereumAddress(tokenId)
            /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
            tokenMetadata = await getErc20TokenMetadata(tokenId, networkId, get(network) as INetwork)
        } catch {
            // do nothing
        }
    } else if (networkId && isStardustNetwork(networkId)) {
        const account = get(activeAccounts)?.[0]
        if (account) {
            tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId, account)
        }
    }
    if (tokenMetadata) {
        const verification: TokenVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        return buildPersistedTokenFromMetadata(tokenId, tokenMetadata, verification)
    }
}
