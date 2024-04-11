import { IEvmNetwork } from '@core/network/interfaces'
import { ContractType } from '../enums'
import { IToken } from '@core/token/interfaces'

export function getErc20TransferSmartContractData(
    recipientAddress: string,
    token: IToken,
    amount: bigint,
    evmNetwork: IEvmNetwork
): string {
    const contract = evmNetwork.getContract(ContractType.Erc20, token.id)
    return contract.methods.transfer(recipientAddress, String(amount)).encodeABI() ?? ''
}
