import { NetworkId } from '@core/network/types'
import { NftStandard } from '../enums'
import { IErc721ContractMetadata, IErc721TokenMetadata } from '../interfaces'

export interface IBasePersistedNft {
    standard: NftStandard
    ownerAddress: string
    contentType?: string
    contentLength?: string
    responseCode?: number
    downloadUrl?: string
    error?: { message: string }
}

export interface IPersistedIrc27Nft extends IBasePersistedNft {
    standard: NftStandard.Irc27
}

export interface IPersistedErc721Nft extends IBasePersistedNft {
    standard: NftStandard.Erc721
    networkId: NetworkId
    contractMetadata: IErc721ContractMetadata
    tokenId?: string
    tokenMetadata?: IErc721TokenMetadata
}
