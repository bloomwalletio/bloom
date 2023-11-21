import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account/interfaces'
import { activeAccounts } from '@core/profile/stores'
import { getNftId } from '@core/activity/utils/outputs'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { INft } from '../interfaces'
import { buildNftFromNftOutput } from './buildNftFromNftOutput'
import { setAccountNftsInAllAccountNfts } from './setAccountNftsInAllAccountNfts'
import { getActiveNetworkId, getNetwork } from '@core/network'
import { getPersistedEvmTransactions } from '@core/activity'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { AssetType } from '@core/layer-2'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { getNftsFromNftIds } from '../utils'

export async function loadNftsForActiveProfile(): Promise<void> {
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        await loadNftsForAccount(account)
    }
}

async function loadNftsForAccount(account: IAccountState): Promise<void> {
    const accountNfts: INft[] = []
    const unspentOutputs = await account.unspentOutputs()
    const networkId = getActiveNetworkId()
    for (const outputData of unspentOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nft = buildNftFromNftOutput(outputData as IWrappedOutput, networkId, account.depositAddress)
            accountNfts.push(nft)
        }
    }

    for (const chain of getNetwork()?.getChains() ?? []) {
        const transactionsOnChain = getPersistedEvmTransactions(account.index, chain)
        const nftIdsOnChain = []
        for (const transaction of transactionsOnChain) {
            const { asset } = getTransferInfoFromTransactionData(transaction, chain) ?? {}
            if (asset?.type !== AssetType.Nft || accountNfts.some((nft) => nft.id === asset.nftId)) {
                continue
            }

            nftIdsOnChain.push(asset.nftId)
        }
        const nfts = await getNftsFromNftIds(nftIdsOnChain, networkId)
        accountNfts.push(...nfts)
    }

    const nftOutputs = await account.outputs({ outputTypes: [OutputType.Nft] })
    const sortedNftOutputs = nftOutputs.sort(
        (a, b) => b.metadata.milestoneTimestampBooked - a.metadata.milestoneTimestampBooked
    )
    for (const outputData of sortedNftOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nftOutput = outputData.output as NftOutput
            const nftId = getNftId(nftOutput.nftId, outputData.outputId)
            if (!accountNfts.some((nft) => nft.id === nftId)) {
                const nft = buildNftFromNftOutput(
                    outputData as IWrappedOutput,
                    networkId,
                    account.depositAddress,
                    false
                )
                accountNfts.push(nft)
            }
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)
    void addNftsToDownloadQueue(account.index, accountNfts)
}
