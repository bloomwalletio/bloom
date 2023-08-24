import { ContractType } from '../enums'
import { IErc20Metadata } from '@core/token/interfaces'
import { TokenStandard } from '@core/token/enums'
import { INetwork } from '@core/network/interfaces'
import { NetworkId } from '@core/network/types'

export async function getErc20TokenMetadata(
    tokenAddress: string,
    networkId: NetworkId,
    network: INetwork
): Promise<IErc20Metadata | undefined> {
    const chain = network?.getChain(networkId)
    const contract = chain?.getContract(ContractType.Erc20, tokenAddress)
    if (contract) {
        const [name, symbol, decimals] = await Promise.all([
            contract.methods.name().call(),
            contract.methods.symbol().call(),
            contract.methods.decimals().call(),
        ])
        return { standard: TokenStandard.Erc20, name, symbol, decimals }
    }
}
