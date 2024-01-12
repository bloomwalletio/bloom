import { EvmTransactionData, TransferredAsset } from '../types'
import { IChain } from '@core/network'
import { localize } from '@core/i18n'
import { buildEvmTransactionData } from './buildEvmTransactionData'
import { Nft, NftStandard } from '@core/nfts'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getIscpTransferSmartContractData } from '../actions/getIscpTransferSmartContractData'
import { getErc721TransferSmartContractData } from '.'
import { AssetType } from '../enums'

export async function buildEvmTransactionDataForNft(
    chain: IChain,
    originAddress: string,
    recipientAddress: string,
    nft: Nft
): Promise<EvmTransactionData> {
    const destinationAddress = getDestinationAddressForNft(nft)
    const data = getNftDataForTransaction(chain, originAddress, recipientAddress, nft)

    if (!data) {
        throw new Error(localize('error.web3.unableToFormSmartContractData'))
    }
    return buildEvmTransactionData(chain, originAddress, destinationAddress, '0', data)
}

function getNftDataForTransaction(
    chain: IChain,
    originAddress: string,
    recipientAddress: string,
    nft: Nft
): string | undefined {
    const transferredAsset = { type: AssetType.Nft, nft } as TransferredAsset
    switch (nft.standard) {
        case NftStandard.Irc27:
            return getIscpTransferSmartContractData(recipientAddress, transferredAsset, chain)
        case NftStandard.Erc721: {
            return getErc721TransferSmartContractData(originAddress, recipientAddress, nft, chain)
        }
        default:
            return undefined
    }
}

function getDestinationAddressForNft(nft: Nft): string {
    const standard = nft?.standard
    switch (standard) {
        case NftStandard.Erc721:
            return nft.contractMetadata.address
        case NftStandard.Irc27:
            return ISC_MAGIC_CONTRACT_ADDRESS
        default:
            throw new Error(localize('error.send.invalidSendParameters'))
    }
}
