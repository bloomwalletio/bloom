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
import { buildNftFromPersistedErc721Nft, getNftsFromNftIds } from '../utils'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { getPersistedErc721Nfts } from './getPersistedErc721Nfts'

export async function loadNftsForActiveProfile(): Promise<void> {
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        await loadNftsForAccount(account)
    }
}

export async function loadNftsForAccount(account: IAccountState): Promise<void> {
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
        // Wrapped L1 NFTs
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

        // ERC721 NFTs
        const coinType = chain.getConfiguration().coinType
        const erc721Nfts = getPersistedErc721Nfts(account.evmAddresses[coinType] as string)
        const convertedNfts: INft[] = erc721Nfts.map((persistedErc721Nft) =>
            buildNftFromPersistedErc721Nft(persistedErc721Nft)
        )
        accountNfts.push(...convertedNfts)
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
