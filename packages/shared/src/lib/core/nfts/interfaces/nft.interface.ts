import { Address } from '@iota/sdk/out/types'
import { NetworkId } from '@core/network/types'
import { NftStandard } from '../enums'
import { INftDownloadStatus, IIrc27Metadata, IErc721ContractMetadata, IErc721TokenMetadata } from '../interfaces'

export type Nft = IIrc27Nft | IErc721Nft

export interface IIrc27Nft extends IBaseNft {
    standard: NftStandard.Irc27
    rawMetadata: string
    metadata?: IIrc27Metadata
    issuer?: Address
    timelockTime?: number
    latestOutputId: string
    storageDeposit: number
}

export interface IErc721Nft extends IBaseNft {
    standard: NftStandard.Erc721
    contractMetadata: IErc721ContractMetadata
    tokenMetadata?: IErc721TokenMetadata
    tokenId?: string
}

interface IBaseNft {
    id: string
    networkId: NetworkId
    address: string
    ownerAddress: string
    name: string
    composedUrl: string
    downloadUrl: string
    filePath: string
    downloadMetadata?: INftDownloadStatus
    isSpendable: boolean
}
