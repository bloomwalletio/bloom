import { ContractType } from '../enums'
import { IErc20Metadata } from '@core/token/interfaces'
import { TokenStandard } from '@core/token/enums'
import { NetworkId } from '@core/network/types'
import { getNetwork } from '@core/network'
import { IErc721ContractMetadata, NftStandard } from '@core/nfts'

export async function getEvmTokenMetadata(
    tokenAddress: string,
    networkId: NetworkId,
    tokenType: ContractType = ContractType.Erc20
): Promise<IErc20Metadata | IErc721ContractMetadata | undefined> {
    const network = getNetwork()
    const chain = network?.getChain(networkId)
    const contract = chain?.getContract(tokenType, tokenAddress)
    if (contract) {
        const isErc20 = tokenType === ContractType.Erc20
        const [name, symbol, decimals] = await Promise.all([
            contract.methods.name().call(),
            contract.methods.symbol().call(),
            isErc20 ? contract.methods.decimals().call() : 0,
        ])
        const standard = isErc20 ? TokenStandard.Erc20 : NftStandard.Erc721
        return { standard, name, symbol, decimals, address: tokenAddress }
    }
}
