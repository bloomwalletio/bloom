import { NetworkId } from '@core/network/types'

export type UntrackedTokens = {
    [key in NetworkId]?: {
        [tokenId: string]: undefined
    }
}
