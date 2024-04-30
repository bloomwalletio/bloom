import { NftStandard } from '../enums'
import { Nft } from './nft.interface'

export interface Collection {
    id?: string
    standard: NftStandard
    name: string
    type: string
    uri: string
    nfts: Nft[]
}
