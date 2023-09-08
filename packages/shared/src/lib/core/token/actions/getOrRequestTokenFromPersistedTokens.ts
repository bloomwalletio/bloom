import { IPersistedToken } from '../interfaces'
import { requestPersistedToken } from '.'
import { addPersistedToken, getPersistedToken } from '../stores'
import { NetworkId } from '@core/network/types'

export async function getOrRequestTokenFromPersistedTokens(
    tokenId: string,
    networkId: NetworkId,
    persistTokenIfNotPresent = true
): Promise<IPersistedToken | undefined> {
    const persistedAsset = getPersistedToken(tokenId)
    if (persistedAsset) {
        return Promise.resolve(persistedAsset)
    } else {
        const tokenToPersist = await requestPersistedToken(tokenId, networkId)
        if (tokenToPersist && persistTokenIfNotPresent) {
            addPersistedToken(tokenToPersist)
        }
        return tokenToPersist
    }
}
