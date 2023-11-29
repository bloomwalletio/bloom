import { NftStandard } from '../enums'

export interface IErc721Metadata {
    standard: NftStandard.Erc721
    address: string
    name: string
    symbol: string
    tokenUri?: string
    extendedMetadata?: IErc721ExtendedMetadata
}

export interface IErc721ExtendedMetadata {
    title: string
    type: string
    properties: {
        name: IErc721ExtendedMetadataProp
        description: IErc721ExtendedMetadataProp
        image: IErc721ExtendedMetadataProp
    }
}

export interface IErc721ExtendedMetadataProp {
    type: string
    description: string
}
