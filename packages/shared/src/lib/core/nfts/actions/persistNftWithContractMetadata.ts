import { EvmNetworkId } from '@core/network'
import { IErc721ContractMetadata, IPersistedErc721Nft } from '../interfaces'
import { addPersistedNft } from '../stores'
import { buildPersistedErc721Nft } from '../utils'
import { isNftPersisted } from './isNftPersisted'
import { Contract, ContractAbi } from 'web3'

export async function persistNftWithContractMetadata(
    ownerAddress: string,
    networkId: EvmNetworkId,
    contractMetadata: IErc721ContractMetadata,
    tokenId: string,
    contract: Contract<ContractAbi>
): Promise<IPersistedErc721Nft | undefined> {
    const nftId = tokenId
        ? `${contractMetadata.address.toLowerCase()}:${tokenId.toLowerCase()}`
        : contractMetadata.address.toLowerCase()
    if (isNftPersisted(nftId)) {
        return
    }
    const persistedNft = await buildPersistedErc721Nft(
        nftId,
        ownerAddress,
        networkId,
        tokenId,
        contract,
        contractMetadata
    )
    addPersistedNft(nftId, persistedNft)
    return persistedNft
}
