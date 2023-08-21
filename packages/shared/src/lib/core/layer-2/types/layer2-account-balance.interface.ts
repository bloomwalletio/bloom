import { NetworkId } from '@core/network/types'

export type Layer2AccountBalance = {
    [networkId in NetworkId]: {
        [tokenId: string]: number
    }
}
