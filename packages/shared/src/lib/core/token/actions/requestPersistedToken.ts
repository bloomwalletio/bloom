import { validateEthereumAddress } from '@core/utils/crypto/utils'
import { OFFICIAL_TOKEN_IDS } from '../constants'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IErc20Metadata, IIrc30Metadata, IPersistedToken } from '../interfaces'
import { TokenVerification } from '../types'
import { buildPersistedTokenFromMetadata } from '../utils'
import { getIrc30MetadataFromFoundryOutput } from '@core/wallet/utils/getIrc30MetadataFromFoundryOutput'
import { getErc20TokenMetadata } from '@core/layer-2/utils/getErc20TokenMetadata'

export async function requestPersistedToken(tokenId: string, chainId?: number): Promise<IPersistedToken | undefined> {
    let tokenMetadata: IIrc30Metadata | IErc20Metadata | undefined
    if (chainId) {
        try {
            validateEthereumAddress(tokenId)
            tokenMetadata = await getErc20TokenMetadata(tokenId, chainId)
        } catch {
            // do nothing
        }
    } else {
        tokenMetadata = await getIrc30MetadataFromFoundryOutput(tokenId)
    }
    if (tokenMetadata) {
        const verification: TokenVerification = OFFICIAL_TOKEN_IDS.includes(tokenId)
            ? { verified: true, status: VerifiedStatus.Official }
            : { verified: false, status: NotVerifiedStatus.New }
        const persistedAsset: IPersistedToken = buildPersistedTokenFromMetadata(tokenId, tokenMetadata, verification)
        return persistedAsset
    }
}
