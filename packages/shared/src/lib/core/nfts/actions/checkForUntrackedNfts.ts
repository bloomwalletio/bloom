import { IAccountState } from '@core/account/interfaces'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'

import { NftStandard } from '../enums'
import { buildNftFromNftMetadata } from '@core/nfts/actions/buildNftFromNftMetadata'
import { convertExplorerAssetToNftMetadata } from '@core/nfts'

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
        /* eslint-disable no-console */
        console.log('nfts: ', nfts)
        nfts.forEach((nft) => {
            const metadata = convertExplorerAssetToNftMetadata(nft)
            console.log('metadata: ', metadata)
            if (metadata) {
                const _nft = buildNftFromNftMetadata(metadata)
                console.log('nft: ', _nft)
            }
        })
    })
}
