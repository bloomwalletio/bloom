import { MimeType, NftStandard } from '../enums'
import { INftAttribute } from './nft-attribute.interface'
import { ISoonaverseAttributes } from './soonaverse-attributes.interface'

export interface IErc721TokenMetadata extends INftMetadata {
    description: string
    date: number
    edition: number
    dna: string
    attributes: INftAttribute[]
}

export interface IIrc27Metadata extends INftMetadata {
    standard: NftStandard.Irc27
    version: string
    collectionName?: string
    royalties?: Record<string, number>
    issuerName?: string
    description?: string
    attributes?: INftAttribute[]
    soonaverseAttributes?: ISoonaverseAttributes
}

export interface INftMetadata {
    type: MimeType
    uri: string
    name: string
}
