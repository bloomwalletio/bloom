import { Contract } from '@core/layer-2'
import { NetworkId } from '@core/network'
import { TokenTrackingStatus } from '@core/token'
import { IErc721ContractMetadata, IPersistedErc721Nft } from '../interfaces'
import { addPersistedNft } from '../stores'
import { buildPersistedErc721Nft } from '../utils'
import { addNewTrackedNftToActiveProfile } from './addNewTrackedNftToActiveProfile'
import { isNftPersisted } from './isNftPersisted'

export async function persistNftWithContractMetadata(
    ownerAddress: string,
    networkId: NetworkId,
    contractMetadata: IErc721ContractMetadata,
    tokenId: string,
    contract: Contract
): Promise<IPersistedErc721Nft | undefined> {
    const { address } = contractMetadata
    const nftId = `${address}:${tokenId}`
    if (isNftPersisted(nftId)) {
        return
    }
    const persistedNft = await buildPersistedErc721Nft(ownerAddress, networkId, tokenId, contract, contractMetadata)
    addPersistedNft(nftId, persistedNft)
    addNewTrackedNftToActiveProfile(networkId, nftId, TokenTrackingStatus.AutomaticallyTracked)
    return persistedNft
}