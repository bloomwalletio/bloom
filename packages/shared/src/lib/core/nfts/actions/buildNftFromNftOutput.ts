import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'
import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/activity/utils/outputs'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { DEFAULT_NFT_NAME } from '../constants'
import { IIrc27Nft } from '../interfaces'
import { getSpendableStatusFromUnspentNftOutput, parseNftMetadata } from '../utils'
import { NetworkId } from '@core/network/types'
import { isEvmNetwork } from '@core/network'
import { MimeType, NftStandard } from '@core/nfts'
import { persistedNftForActiveProfile } from '../stores'
import { get } from 'svelte/store'

export function buildNftFromNftOutput(
    wrappedOutput: IWrappedOutput,
    networkId: NetworkId,
    accountAddress: string,
    calculateStatus: boolean = true
): IIrc27Nft {
    const nftOutput = wrappedOutput.output as NftOutput

    let isSpendable = false
    let timeLockTime: number | undefined

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
    const mediaUrl = parsedMetadata?.uri ?? ''
    const storageDeposit = BigInt(nftOutput.amount)

    const persistedNft = get(persistedNftForActiveProfile)?.[id]

    return {
        standard: NftStandard.Irc27,
        type: parsedMetadata?.type ?? MimeType.TextPlain,
        id,
        nftAddress: address,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        description: parsedMetadata?.description,
        issuer,
        isSpendable: isEvmNetwork(networkId) ? true : isSpendable,
        timelockTime: timeLockTime ? Number(timeLockTime) : undefined,
        rawMetadata,
        metadata: parsedMetadata,
        latestOutputId: wrappedOutput.outputId,
        mediaUrl,
        storageDeposit,
        networkId,
        isLoaded: false,
        downloadMetadata: persistedNft?.downloadMetadata,
        hidden: persistedNft?.hidden ?? false,
    }
}
