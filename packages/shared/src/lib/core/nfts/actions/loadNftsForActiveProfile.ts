import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account/interfaces'
import { activeAccounts } from '@core/profile/stores'
import { getNftId } from '@core/activity/utils/outputs'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { buildNftFromNftOutput } from './buildNftFromNftOutput'
import { setAccountNftsInAllAccountNfts } from './setAccountNftsInAllAccountNfts'
import { getActiveNetworkId, getNetwork } from '@core/network'
import { ActivityType, getPersistedEvmTransactions } from '@core/activity'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { buildNftFromPersistedErc721Nft, getNftsFromNftIds } from '../utils'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { getPersistedErc721Nfts } from './getPersistedErc721Nfts'
import { getAddressFromAccountForNetwork } from '@core/account'

export async function loadNftsForActiveProfile(): Promise<void> {
    let nftsToDownload: Nft[] = []
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        const accountNfts = await loadNftsForAccount(account)
        nftsToDownload = [...nftsToDownload, ...accountNfts]
    }

    nftsToDownload = [...new Set(nftsToDownload)]
    void addNftsToDownloadQueue(nftsToDownload)
}

export async function loadNftsForAccount(account: IAccountState): Promise<Nft[]> {
    const accountNfts: Nft[] = []
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
            const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
            if (transferInfo?.type !== ActivityType.Nft) {
                continue
            }
            if (transferInfo.nftId.includes(':')) {
                continue
            }
            const alreadyAdded = accountNfts.some((nft) => nft.id === transferInfo.nftId)
            if (alreadyAdded) {
                continue
            }

            nftIdsOnChain.push(transferInfo.nftId)
        }
        const nfts = await getNftsFromNftIds(nftIdsOnChain, networkId)
        accountNfts.push(...nfts)

        // ERC721 NFTs
        const evmAddress = getAddressFromAccountForNetwork(account, chain.getConfiguration().id)
        if (!evmAddress) {
            continue
        }
        const erc721Nfts = getPersistedErc721Nfts()
        const convertedNfts: Nft[] = erc721Nfts.map((persistedErc721Nft) =>
            buildNftFromPersistedErc721Nft(persistedErc721Nft, evmAddress)
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

            const alreadyAdded = accountNfts.some((nft) => nft.id === nftId)
            if (!alreadyAdded) {
                const nft = buildNftFromNftOutput(outputData as IWrappedOutput, networkId, account.depositAddress)
                accountNfts.push(nft)
            }
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)

    return accountNfts
}
