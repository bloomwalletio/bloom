import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'
import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/activity/utils/outputs'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { DEFAULT_NFT_NAME } from '../constants'
import { Nft } from '../interfaces'
import { composeUrlFromNftUri, getSpendableStatusFromUnspentNftOutput, parseNftMetadata } from '../utils'
import { NetworkId } from '@core/network/types'
import { isEvmChain } from '@core/network'
import { NftStandard } from '@core/nfts'

export function buildNftFromNftOutput(
    wrappedOutput: IWrappedOutput,
    networkId: NetworkId,
    accountAddress: string,
    calculateStatus: boolean = true
): Nft {
    const nftOutput = wrappedOutput.output as NftOutput

    let isSpendable = false
    let timeLockTime = undefined

    if (calculateStatus) {
        const status = getSpendableStatusFromUnspentNftOutput(accountAddress, nftOutput)
        isSpendable = status.isSpendable
        timeLockTime = status.timeLockTime
    }

    const id = getNftId(nftOutput.nftId, wrappedOutput.outputId)
    const address = getBech32AddressFromAddressTypes({
        type: AddressType.Nft,
        nftId: id,
    } as unknown as Address) as string
    const issuer = getIssuerFromNftOutput(nftOutput)
    const rawMetadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(rawMetadata)
    const composedUrl = composeUrlFromNftUri(parsedMetadata?.uri) ?? ''
    const storageDeposit = Number(nftOutput.amount)

    return {
        standard: NftStandard.Irc27,
        id,
        address,
        ownerAddress: accountAddress,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isSpendable: isEvmChain(networkId) ? true : isSpendable,
        timelockTime: timeLockTime ? Number(timeLockTime) : undefined,
        rawMetadata,
        metadata: parsedMetadata,
        latestOutputId: wrappedOutput.outputId,
        composedUrl,
        storageDeposit,
        networkId,
    }
}
