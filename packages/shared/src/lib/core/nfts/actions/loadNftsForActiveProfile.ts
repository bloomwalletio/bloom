import { getAddressFromAccountForNetwork } from '@core/account'
import { IAccountState } from '@core/account/interfaces'
import { StardustActivityType } from '@core/activity'
import { getNftId } from '@core/activity/utils/outputs'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { getActiveNetworkId, getEvmNetworks } from '@core/network'
import { activeAccounts, getActiveProfileId } from '@core/profile/stores'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { buildNftFromPersistedErc721Nft, getNftsFromNftIds } from '../utils'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { buildNftFromNftOutput } from './buildNftFromNftOutput'
import { getPersistedErc721NftsForNetwork } from './getPersistedErc721NftsForNetwork'
import { setAccountNftsInAllAccountNfts } from './setAccountNftsInAllAccountNfts'

export async function loadNftsForActiveProfile(): Promise<void> {
    let nftsToDownload: Nft[] = []
    const profileId = getActiveProfileId()
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        const accountNfts = await loadNftsForAccount(profileId, account)
        nftsToDownload = [...nftsToDownload, ...accountNfts]
    }

    nftsToDownload = [...new Set(nftsToDownload)]
    void addNftsToDownloadQueue(nftsToDownload)
}

export async function loadNftsForAccount(profileId: string, account: IAccountState): Promise<Nft[]> {
    const accountNfts: Nft[] = []
    const unspentOutputs = await account.unspentOutputs()
    const networkId = getActiveNetworkId()
    for (const outputData of unspentOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nft = buildNftFromNftOutput(outputData as IWrappedOutput, networkId, account.depositAddress)
            accountNfts.push(nft)
        }
    }

    for (const evmNetwork of getEvmNetworks()) {
        // Wrapped L1 NFTs
        const transactionsOnChain = getPersistedTransactionsForChain(profileId, account.index, evmNetwork)
        const nftIdsOnChain: string[] = []
        for (const transaction of transactionsOnChain) {
            if (!transaction.local) {
                continue
            }
            const transferInfo = getTransferInfoFromTransactionData(transaction.local, evmNetwork)
            if (transferInfo?.type !== StardustActivityType.Nft) {
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
        const evmAddress = getAddressFromAccountForNetwork(account, evmNetwork.id)
        if (!evmAddress) {
            continue
        }
        const erc721Nfts = getPersistedErc721NftsForNetwork(evmNetwork.id)
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
