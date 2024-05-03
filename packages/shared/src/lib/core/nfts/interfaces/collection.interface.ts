import { IErc721ContractMetadata } from './erc721-contract-metadata.interface'
import { IIrc27Metadata } from './nft-metadata.interface'
import { IErc721Nft, IIrc27Nft } from './nft.interface'

export type Collection = IIrc27Collection | IErc721Collection

export interface IIrc27Collection extends IIrc27Metadata, IBaseCollection {
    nfts: IIrc27Nft[]
}

export interface IErc721Collection extends IErc721ContractMetadata, IBaseCollection {
    nfts: IErc721Nft[]
}

interface IBaseCollection {
    id: string
}
