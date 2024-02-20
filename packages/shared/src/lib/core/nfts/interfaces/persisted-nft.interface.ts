import { NetworkId } from '@core/network/types'
import { NftStandard } from '../enums'
import { IDownloadMetadata, IErc721ContractMetadata, IErc721TokenMetadata, IIrc27Metadata } from '../interfaces'

export interface IBasePersistedNft {
    id: string
    standard: NftStandard
    ownerAddress: string
    downloadMetadata?: IDownloadMetadata
    composedUrl?: string
}

export interface IPersistedIrc27Nft extends IBasePersistedNft {
    standard: NftStandard.Irc27
    rawMetadata?: string
    metadata?: IIrc27Metadata
}

export interface IPersistedErc721Nft extends IBasePersistedNft {
    standard: NftStandard.Erc721
    networkId: NetworkId
    contractMetadata: IErc721ContractMetadata
    tokenId?: string
    uri: string
    metadata?: IErc721TokenMetadata
}
