import { Address } from '@iota/sdk/out/types'
import { NetworkId } from '@core/network/types'
import { NftStandard } from '../enums'
import { NftDownloadMetadata, IIrc27Metadata, IErc721ContractMetadata, IErc721TokenMetadata } from '../interfaces'

export interface INft {
    id: string
    networkId: NetworkId
    address: string
    name: string
    rawMetadata?: string
    metadata?: IIrc27Metadata
    issuer?: Address
    isSpendable: boolean
    timelockTime?: number
    latestOutputId: string
    composedUrl: string
    downloadUrl: string
    storageDeposit: number
    filePath: string
    downloadMetadata: NftDownloadMetadata
}

interface IBaseNft {
    id: string
    networkId: NetworkId
    address: string
    name: string
    composedUrl: string
    downloadUrl: string
    filePath: string
    downloadMetadata: NftDownloadMetadata
}

export interface IIrc27Nft extends IBaseNft {
    standard: NftStandard.Irc27
    metadata: string
    parsedMetadata?: IIrc27Metadata
    issuer?: Address
    isSpendable: boolean
    timelockTime?: number
    latestOutputId: string
    storageDeposit: number
}

export interface IErc721Nft extends IBaseNft {
    standard: NftStandard.Irc27
    metadata: {
        contract: IErc721ContractMetadata
        token?: IErc721TokenMetadata
    }
    tokenId: string
}

// TODO: Rename to Nft
export type Nft = IIrc27Nft | IErc721Nft
