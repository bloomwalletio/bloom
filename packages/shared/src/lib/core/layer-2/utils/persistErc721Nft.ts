import { getEvmTokenMetadata } from '@core/layer-2/utils'
import { ContractType } from '../enums'
import { NetworkId } from '@core/network/types'
import { persistNftWithContractMetadata } from '@core/nfts/actions'
import { IErc721ContractMetadata, IPersistedErc721Nft } from '@core/nfts'
import { getNetwork } from '@core/network'

export async function persistErc721Nft(
    tokenAddress: string,
    tokenId: string,
    networkId: NetworkId
): Promise<IPersistedErc721Nft | undefined> {
    const network = getNetwork()
    const chain = network?.getChain(networkId)
    const contract = chain?.getContract(ContractType.Erc721, tokenAddress)
    if (contract) {
        const metadata = (await getEvmTokenMetadata(
            tokenAddress,
            networkId,
            ContractType.Erc721
        )) as unknown as IErc721ContractMetadata
        const owner: string = await contract.methods.ownerOf(tokenId).call()
        return persistNftWithContractMetadata(owner.toLowerCase(), networkId, metadata, tokenId, contract)
    }
}
