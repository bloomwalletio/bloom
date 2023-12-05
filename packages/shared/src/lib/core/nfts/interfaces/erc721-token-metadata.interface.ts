export interface IErc721TokenMetadata {
    name: string
    image: string
    description: string
    date: number
    edition: number
    dna: string
    attributes: IErc721TokenMetadataAttribute[]
}

export interface IErc721TokenMetadataAttribute {
    traitType: string
    value: number | string
}
