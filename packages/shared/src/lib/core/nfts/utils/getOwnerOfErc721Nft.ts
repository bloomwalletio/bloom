import { ContractType } from '@core/layer-2'
import { getNetwork } from '@core/network'
import { IErc721Nft, IPersistedErc721Nft } from '../interfaces'

export async function getOwnerOfErc721Nft(nft: IPersistedErc721Nft | IErc721Nft): Promise<string> {
    const { networkId, contractMetadata, tokenId } = nft
    const network = getNetwork()?.getChain(networkId)
    const contract = network?.getContract(ContractType.Erc721, contractMetadata.address)
    const owner = await contract?.methods.ownerOf(tokenId).call()
    return owner?.toLowerCase()
}
