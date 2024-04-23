import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/activity/utils/outputs'
import { isEvmNetwork } from '@core/network'
import { NetworkId } from '@core/network/types'
import { MimeType, NftStandard } from '@core/nfts'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { DEFAULT_NFT_NAME } from '../constants'
import { IIrc27Nft } from '../interfaces'
import { persistedNftForActiveProfile } from '../stores'
import { getSpendableStatusFromUnspentNftOutput, isScamIrc27Nft, parseNftMetadata } from '../utils'
import { getExpirationDateFromOutput } from '@core/activity/utils/outputs'

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
        isSpendable = wrappedOutput.isSpent ? false : status.isSpendable
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

    const isScam = persistedNft?.isScam ?? (parsedMetadata ? isScamIrc27Nft(parsedMetadata) : false)
    const expirationTime = getExpirationDateFromOutput(nftOutput)?.getTime()

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
        expirationTime,
        rawMetadata,
        metadata: parsedMetadata,
        latestOutputId: wrappedOutput.outputId,
        mediaUrl,
        storageDeposit,
        networkId,
        isLoaded: false,
        downloadMetadata: persistedNft?.downloadMetadata,
        isScam,
        hidden: persistedNft?.hidden ?? false,
    }
}
