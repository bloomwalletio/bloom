import { INetwork } from '@core/network/interfaces'
import { TokenStandard } from '@core/wallet/enums'
import { IErc20Metadata } from '@core/wallet/interfaces'
import { ContractType } from '../enums'

export async function getErc20TokenMetadata(
    tokenAddress: string,
    chainId: number,
    network: INetwork
): Promise<IErc20Metadata | undefined> {
    const chain = network?.getChain(chainId)
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
