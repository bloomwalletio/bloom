import { NetworkId } from '@core/network/types'
import { Address } from '@iota/sdk/out/types'
import { MimeType, NftStandard } from '../enums'
import { IDownloadMetadata, IErc721ContractMetadata, IErc721TokenMetadata, IIrc27Metadata } from '../interfaces'

export type Nft = IIrc27Nft | IErc721Nft

export interface IIrc27Nft extends IBaseNft {
    standard: NftStandard.Irc27
    nftAddress: string
    rawMetadata: string
    metadata?: IIrc27Metadata
    issuer?: Address
    timelockTime?: number
    latestOutputId: string
    storageDeposit: bigint
}

export interface IErc721Nft extends IBaseNft {
    standard: NftStandard.Erc721
    uri: string
    contractMetadata: IErc721ContractMetadata
    tokenId?: string
    metadata?: IErc721TokenMetadata
}

interface IBaseNft {
    id: string
    type: MimeType
    networkId: NetworkId
    name: string
    description?: string
    collectionName?: string
    composedUrl?: string
    downloadMetadata?: IDownloadMetadata
    isLoaded: boolean
    isSpendable: boolean
}
