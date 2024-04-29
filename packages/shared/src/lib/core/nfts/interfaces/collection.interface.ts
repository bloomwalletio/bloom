import { NftStandard } from '../enums'
import { Nft } from './nft.interface'

export interface Collection {
    standard: NftStandard
    name: string
    type: string
    uri: string
    nfts: Nft[]
}
