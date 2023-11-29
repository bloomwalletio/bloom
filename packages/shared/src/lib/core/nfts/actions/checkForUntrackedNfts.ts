import { IAccountState } from '@core/account/interfaces'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'

import { NftStandard } from '../enums'
import { addPersistedNft } from '../stores'
import { buildPersistedNftFromNftMetadata, convertExplorerAssetToNftMetadata } from '../utils'

export function checkForUntrackedNfts(account: IAccountState): Promise<void> {
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const coinType = chain.getConfiguration().coinType
        const evmAddress = account.evmAddresses[coinType]
        if (!evmAddress) {
            return
        }
        const networkId = chain.getConfiguration().id
        const explorerApi = new EvmExplorerApi(networkId)

        const nfts = await explorerApi.getAssetsForAddress(evmAddress, NftStandard.Erc721)
        nfts.forEach((nft) => {
            const metadata = convertExplorerAssetToNftMetadata(nft)
            if (metadata) {
                // TODO: Only add if not previously added
                addPersistedNft(metadata?.address, buildPersistedNftFromNftMetadata(metadata))
                /* eslint-disable no-console */
                console.log('added nft: ', metadata)
            }
        })
    })
}
