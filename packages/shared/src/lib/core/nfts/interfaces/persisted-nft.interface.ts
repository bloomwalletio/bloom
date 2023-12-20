import { NetworkId } from '@core/network/types'
import { DownloadErrorType, DownloadWarningType, NftStandard } from '../enums'
import { IErc721ContractMetadata, IErc721TokenMetadata, IIrc27Metadata } from '../interfaces'

export interface IBasePersistedNft {
    standard: NftStandard
    ownerAddress: string
    downloadMetadata: DownloadMetadata
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
    contractAddress: string
    contractMetadata: IErc721ContractMetadata
    tokenId?: string
    uri: string
    metadata?: IErc721TokenMetadata
}

export interface DownloadMetadata {
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    filePath?: string
    error?: {
        type: DownloadErrorType
        message?: string
    }
    warning?: {
        type: DownloadWarningType
        message?: string
    }
}
