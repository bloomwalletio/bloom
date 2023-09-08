import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'
import { getIssuerFromNftOutput, getMetadataFromNftOutput, getNftId } from '@core/activity/utils/outputs'
import { activeProfileId } from '@core/profile/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { get } from 'svelte/store'
import { DEFAULT_NFT_NAME } from '../constants'
import { INft } from '../interfaces'
import { composeUrlFromNftUri, getSpendableStatusFromUnspentNftOutput, parseNftMetadata } from '../utils'
import { getActiveNetworkId } from '@core/network'

export function buildNftFromNftOutput(
    wrappedOutput: IWrappedOutput,
    accountAddress: string,
    calculateStatus: boolean = true
): INft {
    const nftOutput = wrappedOutput.output as NftOutput

    let isSpendable = false
    let timeLockTime = undefined

    if (calculateStatus) {
        const status = getSpendableStatusFromUnspentNftOutput(accountAddress, nftOutput)
        isSpendable = status.isSpendable
        timeLockTime = status.timeLockTime
    }

    const profileId: string = get(activeProfileId)
    const id = getNftId(nftOutput.nftId, wrappedOutput.outputId)
    const address = getBech32AddressFromAddressTypes({ type: AddressType.Nft, nftId: id } as unknown as Address)
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    const composedUrl = composeUrlFromNftUri(parsedMetadata?.uri)
    const filePath = `${profileId}/nfts/${id}`
    const storageDeposit = Number(nftOutput.amount)

    return {
        id,
        address,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isSpendable,
        timelockTime: timeLockTime ? Number(timeLockTime) : undefined,
        metadata,
        parsedMetadata,
        latestOutputId: wrappedOutput.outputId,
        composedUrl,
        downloadUrl: composedUrl,
        filePath,
        storageDeposit,
        networkId: getActiveNetworkId(),
        downloadMetadata: {
            error: undefined,
            warning: undefined,
            isLoaded: false,
        },
    }
}
