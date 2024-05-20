import { IEvmNetwork } from '@core/network/interfaces'
import { IErc721Nft } from '@core/nfts'
import { ERC721_ABI } from '../abis'

export function getErc721TransferSmartContractData(
    originAddress: string,
    recipientAddress: string,
    nft: IErc721Nft,
    evmNetwork: IEvmNetwork
): string {
    const nftAddress = nft.contractMetadata?.address ?? ''
    const nftTokenId = nft.tokenId ?? ''

    const contract = evmNetwork.getContract(ERC721_ABI, nftAddress)
    return contract.methods.safeTransferFrom(originAddress, recipientAddress, nftTokenId).encodeABI() ?? ''
}
