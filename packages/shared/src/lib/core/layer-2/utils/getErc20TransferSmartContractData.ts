import { IChain } from '@core/network/interfaces'
import { IAsset } from '@core/wallet/interfaces'

import { ContractType } from '../enums'

export function getErc20TransferSmartContractData(
    recipientAddress: string,
    asset: IAsset,
    amount: string,
    chain: IChain
): string {
    const contract = chain.getContract(ContractType.Erc20, asset.id)
    return contract.methods.transfer(recipientAddress, amount).encodeABI() ?? ''
}
