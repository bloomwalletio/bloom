import { api } from '@core/profile-manager'
import { EMPTY_HEX_ID } from '@core/wallet/constants'

export function getNftId(nftId: string, outputId: string): string {
    const isNewNft = nftId === EMPTY_HEX_ID
    const realNftId = isNewNft ? api.computeNftId(outputId) : nftId
    return realNftId
}
