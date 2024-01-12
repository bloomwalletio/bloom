import { IChain } from '@core/network/interfaces'
import { ContractType } from '../enums'

export function getErc721TransferSmartContractData(
    originAddress: string,
    recipientAddress: string,
    nftAddress: string,
    nftTokenId: string,
    chain: IChain
): string {
    const contract = chain.getContract(ContractType.Erc721, nftAddress)
    return contract.methods.safeTransferFrom(originAddress, recipientAddress, nftTokenId).encodeABI() ?? ''
}
