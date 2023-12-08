import { NftStandard } from '@core/nfts/enums'
import { MimeType } from '../types'
import { IIrc27Attribute } from './irc27-attribute.interface'
import { ISoonaverseAttributes } from './soonaverse-attributes.interface'

export interface IIrc27Metadata extends INftMetadata {
    standard: NftStandard.Irc27
    collectionName?: string
    royalties?: Record<string, number>
    issuerName?: string
    description?: string
    attributes?: IIrc27Attribute[]
    soonaverseAttributes?: ISoonaverseAttributes
}

export interface INftMetadata {
    version: string
    type: MimeType
    uri: string
    name: string
}
