import { IErc721ContractMetadata } from './erc721-contract-metadata.interface'
import { IIrc27Metadata } from './nft-metadata.interface'

interface IBaseCollection {
    id: string
}

export type PersistedCollection = IPersistedIrc27Collection | IPersistedErc721Collection

export interface IPersistedIrc27Collection extends IIrc27Metadata, IBaseCollection {}

export interface IPersistedErc721Collection extends IErc721ContractMetadata, IBaseCollection {}
