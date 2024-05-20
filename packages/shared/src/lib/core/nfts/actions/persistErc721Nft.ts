import { getEvmTokenMetadata } from '@core/layer-2/utils'
import { EvmNetworkId } from '@core/network/types'
import { persistNftWithContractMetadata } from './persistNftWithContractMetadata'
import { IErc721ContractMetadata, IPersistedErc721Nft } from '@core/nfts'
import { getEvmNetwork } from '@core/network'
import { localize } from '@core/i18n'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { ERC721_ABI } from '@core/layer-2'

export async function persistErc721Nft(
    tokenAddress: string,
    tokenId: string,
    networkId: EvmNetworkId,
    expectedOwner?: IAccountState
): Promise<IPersistedErc721Nft | undefined> {
    const evmNetwork = getEvmNetwork(networkId)
    const contract = evmNetwork?.getContract(ERC721_ABI, tokenAddress)
    if (!contract) {
        return
    }

    const metadata = (await getEvmTokenMetadata(tokenAddress, networkId, ERC721_ABI)) as IErc721ContractMetadata
    let owner = await contract.methods.ownerOf(tokenId).call<string>()
    owner = owner.toLowerCase()

    const expectedOwnerAddress = expectedOwner ? getAddressFromAccountForNetwork(expectedOwner, networkId) : undefined
    if (expectedOwner && owner !== expectedOwnerAddress) {
        throw new Error(localize('popups.importToken.errors.otherOwner'))
    }
    return persistNftWithContractMetadata(owner, networkId, metadata, tokenId, contract)
}
