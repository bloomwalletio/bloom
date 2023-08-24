import { IPersistedToken } from '../interfaces'
import { requestPersistedToken } from '.'
import { getPersistedToken } from '../stores'
import { NetworkId } from '@core/network/types'

export async function getOrRequestTokenFromPersistedTokens(
    tokenId: string,
    networkId?: NetworkId
): Promise<IPersistedToken | undefined> {
    const persistedAsset = getPersistedToken(tokenId)
    if (persistedAsset) {
        return Promise.resolve(persistedAsset)
    } else {
        return requestPersistedToken(tokenId, networkId)
    }
}
