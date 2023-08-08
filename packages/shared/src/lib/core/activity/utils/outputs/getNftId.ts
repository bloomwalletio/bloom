import { EMPTY_HEX_ID } from '@core/wallet/constants'
import { hashOutputId } from '@core/wallet/utils'

export function getNftId(nftId: string, outputId: string): string {
    const isNewNft = nftId === EMPTY_HEX_ID
    const realNftId = isNewNft ? hashOutputId(outputId) : nftId
    return realNftId
}
