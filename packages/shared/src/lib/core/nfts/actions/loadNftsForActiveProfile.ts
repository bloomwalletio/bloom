import { IAccountState } from '@core/account/interfaces'
import { getNftId } from '@core/activity/utils/outputs'
import { getActiveNetworkId, getEvmNetworks } from '@core/network'
import { activeAccounts } from '@core/profile/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { buildNftFromNftOutput } from './buildNftFromNftOutput'
import { setNftsForAccount } from '../stores'

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

    for (const evmNetwork of getEvmNetworks()) {
        const nfts = await evmNetwork.getNftsForAccount(account)

        for (const nft of nfts) {
            const alreadyAdded = accountNfts.some((_nft) => _nft.id === nft.id)
            if (!alreadyAdded) {
                accountNfts.push(nft)
            }
        }
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
    setNftsForAccount(account.index, accountNfts)

    return accountNfts
}
