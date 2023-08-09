import { IChain } from '@core/network/interfaces'
import { ContractType } from '../enums'
import { IToken } from '@core/token/interfaces'

export function getErc20TransferSmartContractData(
    recipientAddress: string,
    token: IToken,
    amount: string,
    chain: IChain
): string {
    const contract = chain.getContract(ContractType.Erc20, token.id)
    return contract.methods.transfer(recipientAddress, amount).encodeABI() ?? ''
}
