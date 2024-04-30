import { IErc721ContractMetadata } from './erc721-contract-metadata.interface'
import { IIrc27Metadata } from './nft-metadata.interface'
import { IErc721Nft, IIrc27Nft } from './nft.interface'

export type Collection = Irc27Collection | Erc721Collection

interface Irc27Collection extends IIrc27Metadata, BaseCollection {
    nfts: IIrc27Nft[]
}

interface Erc721Collection extends IErc721ContractMetadata, BaseCollection {
    nfts: IErc721Nft[]
}

interface BaseCollection {
    id: string
}
