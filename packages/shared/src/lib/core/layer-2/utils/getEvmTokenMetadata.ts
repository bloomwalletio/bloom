import { IErc20Metadata } from '@core/token/interfaces'
import { TokenStandard } from '@core/token/enums'
import { NetworkId } from '@core/network/types'
import { getEvmNetwork } from '@core/network'
import { IErc721ContractMetadata, NftStandard } from '@core/nfts'
import { ERC20_ABI } from '../abis'
import { ContractAbi } from 'web3'

export async function getEvmTokenMetadata(
    tokenAddress: string,
    networkId: NetworkId,
    tokenAbi: ContractAbi = ERC20_ABI
): Promise<IErc20Metadata | IErc721ContractMetadata | undefined> {
    const evmNetwork = getEvmNetwork(networkId)
    const contract = evmNetwork?.getContract(tokenAbi, tokenAddress)
    if (contract) {
        const isErc20 = tokenAbi === ERC20_ABI
        const [name, symbol, decimals] = await Promise.all([
            contract.methods.name().call<string>(),
            contract.methods.symbol().call<string>(),
            isErc20 ? contract.methods.decimals().call<number>() : 0,
        ])
        const standard = isErc20 ? TokenStandard.Erc20 : NftStandard.Erc721
        return { standard, name, symbol, decimals, address: tokenAddress }
    }
}
