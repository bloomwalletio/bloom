import { IEvmNetwork } from '@core/network/interfaces'
import { ContractType } from '../enums'
import { IErc721Nft } from '@core/nfts'

export function getErc721TransferSmartContractData(
    originAddress: string,
    recipientAddress: string,
    nft: IErc721Nft,
    evmNetwork: IEvmNetwork
): string {
    const nftAddress = nft.contractMetadata?.address ?? ''
    const nftTokenId = nft.tokenId ?? ''

    const contract = evmNetwork.getContract(ContractType.Erc721, nftAddress)
    return contract.methods.safeTransferFrom(originAddress, recipientAddress, nftTokenId).encodeABI() ?? ''
}
