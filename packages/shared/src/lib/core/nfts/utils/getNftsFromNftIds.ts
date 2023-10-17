import type { NftOutput, OutputResponse } from '@iota/sdk'
import { buildNftFromNftOutput } from '../actions'
import { INft } from '../interfaces'
import { getClient } from '@core/profile-manager'
import { getOutputIdFromTransactionIdAndIndex } from '@core/activity'
import { NetworkId } from '@core/network/types'

export async function getNftsFromNftIds(nftIds: string[], networkId: NetworkId): Promise<INft[]> {
    const client = await getClient()
    const nftOutputIds = []
    for (const nftId of nftIds) {
        try {
            const nftOutputId = await client.nftOutputId(nftId)
            if (nftOutputId) {
                nftOutputIds.push(nftOutputId)
            }
        } catch (err) {
            console.error(err, nftId)
        }
    }

    let outputs: OutputResponse[] = []
    try {
        outputs = await client.getOutputs(nftOutputIds)
    } catch (err) {
        outputs = []
        console.error(err)
    }

    const nfts: INft[] = []
    for (const nftOutput of outputs) {
        const outputId = getOutputIdFromTransactionIdAndIndex(
            nftOutput.metadata.transactionId,
            nftOutput.metadata.outputIndex
        )
        const wrappedOutput = { outputId, output: nftOutput.output as NftOutput }
        const nft = buildNftFromNftOutput(wrappedOutput, networkId, '', false)
        nfts.push(nft)
    }
    return nfts
}
