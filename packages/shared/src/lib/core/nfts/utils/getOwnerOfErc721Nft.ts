import { ERC721_ABI } from '@core/layer-2'
import { getEvmNetwork } from '@core/network'
import { IErc721Nft, IPersistedErc721Nft } from '../interfaces'

export async function getOwnerOfErc721Nft(nft: IPersistedErc721Nft | IErc721Nft): Promise<string> {
    const { networkId, contractMetadata, tokenId } = nft
    const network = getEvmNetwork(networkId)
    const contract = network?.getContract(ERC721_ABI, contractMetadata.address)
    const owner = await contract?.methods.ownerOf(tokenId).call()
    return owner?.toLowerCase()
}
