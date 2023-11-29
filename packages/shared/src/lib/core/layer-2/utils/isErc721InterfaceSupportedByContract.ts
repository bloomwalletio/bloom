import { getNetwork } from '@core/network/stores'
import { NetworkId } from '@core/network/types'
import { ContractType, Erc721InterfaceId } from '../enums'

export async function isErc721InterfaceSupportedByContract(
    networkId: NetworkId,
    contractAddress: string,
    interfaceId: Erc721InterfaceId
): Promise<boolean> {
    const chain = getNetwork()?.getChain(networkId)
    const contract = chain?.getContract(ContractType.Erc721, contractAddress)
    return await contract?.methods.supportsInterface(interfaceId)
}
