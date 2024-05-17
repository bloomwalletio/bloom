import { IEvmNetwork } from '@core/network/interfaces'
import { IToken } from '@core/token/interfaces'
import { ERC20_ABI } from '../abis'

export function getErc20TransferSmartContractData(
    recipientAddress: string,
    token: IToken,
    amount: bigint,
    evmNetwork: IEvmNetwork
): string {
    const contract = evmNetwork.getContract(ERC20_ABI, token.id)
    return contract.methods.transfer(recipientAddress, String(amount)).encodeABI() ?? ''
}
