import { get } from 'svelte/store'

import { getIrc30MetadataFromFoundryOutput } from '@core/wallet/utils/getIrc30MetadataFromFoundryOutput'
import { getEvmTokenMetadata } from '@core/layer-2/utils'
import { activeAccounts } from '@core/profile/stores'

import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IErc20Metadata, IIrc30Metadata, IPersistedToken } from '../interfaces'
import { TokenVerification } from '../types'
import { buildPersistedTokenFromMetadata } from '../utils'
import { NetworkId } from '@core/network/types'
import { isEvmChain, isStardustNetwork } from '@core/network'
import { selectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { isValidEthereumAddress } from '@core/utils/crypto/utils/isValidEthereumAddress'

export async function requestPersistedToken(
    tokenId: string,
    networkId: NetworkId
): Promise<IPersistedToken | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (networkId && isEvmChain(networkId)) {
        try {
            if (isValidEthereumAddress(tokenId)) {
                tokenMetadata = (await getEvmTokenMetadata(tokenId, networkId)) as IErc20Metadata
            } else {
                const account = get(selectedAccount)
                if (account) {
                    tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId, account)
                }
            }
        } catch (err) {
            handleError(err)
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
