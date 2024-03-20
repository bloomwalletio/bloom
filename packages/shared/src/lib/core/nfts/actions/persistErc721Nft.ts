import { getEvmTokenMetadata } from '@core/layer-2/utils'
import { ContractType } from '../../layer-2/enums'
import { NetworkId } from '@core/network/types'
import { persistNftWithContractMetadata } from './persistNftWithContractMetadata'
import { IErc721ContractMetadata, IPersistedErc721Nft } from '@core/nfts'
import { getNetwork } from '@core/network'
import { localize } from '@core/i18n'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'

export async function persistErc721Nft(
    tokenAddress: string,
    tokenId: string,
    networkId: NetworkId,
    expectedOwner?: IAccountState
): Promise<IPersistedErc721Nft | undefined> {
    const network = getNetwork()
    const chain = network?.getChain(networkId)
    const contract = chain?.getContract(ContractType.Erc721, tokenAddress)
    if (!contract) {
        return
    }

    const metadata = (await getEvmTokenMetadata(
        tokenAddress,
        networkId,
        ContractType.Erc721
    )) as IErc721ContractMetadata
    let owner = await contract.methods.ownerOf(tokenId).call()
    owner = owner.toLowerCase()

    const expectedOwnerAddress = expectedOwner ? getAddressFromAccountForNetwork(expectedOwner, networkId) : undefined
    if (expectedOwner && owner !== expectedOwnerAddress) {
        throw new Error(localize('popups.importToken.errors.otherOwner'))
    }
    return persistNftWithContractMetadata(owner, networkId, metadata, tokenId, contract)
}
