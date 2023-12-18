import { INftAttribute } from './nft-attribute.interface'
import { MimeType } from '../enums'

export interface IErc721TokenMetadata {
    type: MimeType
    name: string
    image: string
    description: string
    date: number
    edition: number
    dna: string
    attributes: INftAttribute[]
}
