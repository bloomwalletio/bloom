import { NetworkId } from '@core/network/types'

export interface ILayer2AccountBalance {
    [networkId: NetworkId]: {
        [tokenId: string]: number
    }
}
