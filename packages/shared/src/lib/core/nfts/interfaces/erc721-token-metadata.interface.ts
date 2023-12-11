import { INftAttribute } from './nft-attribute.interface'

export interface IErc721TokenMetadata {
    name: string
    image: string
    description: string
    date: number
    edition: number
    dna: string
    attributes: INftAttribute[]
}
