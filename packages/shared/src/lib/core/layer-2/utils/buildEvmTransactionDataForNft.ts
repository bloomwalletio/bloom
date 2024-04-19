import { EvmTransactionData, TransferredAsset } from '../types'
import { IEvmNetwork, IscChain } from '@core/network'
import { localize } from '@core/i18n'
import { buildEvmTransactionData } from './buildEvmTransactionData'
import { Nft, NftStandard } from '@core/nfts'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { getIscpTransferSmartContractData } from '../actions/getIscpTransferSmartContractData'
import { getErc721TransferSmartContractData } from '.'
import { AssetType } from '../enums'

export async function buildEvmTransactionDataForNft(
    evmNetwork: IEvmNetwork,
    originAddress: string,
    recipientAddress: string,
    nft: Nft
): Promise<EvmTransactionData> {
    const destinationAddress = getDestinationAddressForNft(nft)
    const data = getNftDataForTransaction(evmNetwork, originAddress, recipientAddress, nft)

    if (!data) {
        throw new Error(localize('error.web3.unableToFormSmartContractData'))
    }
    return buildEvmTransactionData(evmNetwork, originAddress, destinationAddress, BigInt(0), data)
}

function getNftDataForTransaction(
    evmNetwork: IEvmNetwork,
    originAddress: string,
    recipientAddress: string,
    nft: Nft
): string | undefined {
    const transferredAsset = { type: AssetType.Nft, nft } as TransferredAsset
    switch (nft.standard) {
        case NftStandard.Irc27:
            return getIscpTransferSmartContractData(recipientAddress, transferredAsset, evmNetwork as IscChain)
        case NftStandard.Erc721: {
            return getErc721TransferSmartContractData(originAddress, recipientAddress, nft, evmNetwork)
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
