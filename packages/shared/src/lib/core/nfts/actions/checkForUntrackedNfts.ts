import { IAccountState } from '@core/account/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { IEvmNetwork } from '@core/network/interfaces'
import features from '@features/features'

import { NftStandard } from '../enums'
import { persistNftWithContractMetadata } from './persistNftWithContractMetadata'
import { buildNftFromPersistedErc721Nft } from '../utils'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { Nft } from '../interfaces'
import { addNewTrackedNftToActiveProfile } from './addNewTrackedNftToActiveProfile'
import { TokenTrackingStatus } from '@core/token'
import { IBlockscoutAsset } from '@auxiliary/blockscout/interfaces'
import { BlockscoutApi } from '@auxiliary/blockscout/api'
import { addOrUpdateNftForAccount } from '../stores'
import { ERC721_ABI } from '@core/layer-2'

export async function checkForUntrackedNfts(account: IAccountState): Promise<void> {
    if (!features?.collectibles?.erc721?.enabled) {
        return
    }

    const evmNetworks = getEvmNetworks()
    for (const evmNetwork of evmNetworks) {
        const evmAddress = account.evmAddresses[evmNetwork.coinType]
        if (!evmAddress || !evmNetwork.explorerUrl) {
            return
        }
        const blockscoutApi = new BlockscoutApi(evmNetwork.id)

        const explorerNfts = await blockscoutApi.getAssetsForAddress(evmAddress, NftStandard.Erc721)
        for (const explorerNft of explorerNfts) {
            await persistNftsFromExplorerAsset(account, evmAddress, explorerNft, evmNetwork)
        }
    }
}

async function persistNftsFromExplorerAsset(
    account: IAccountState,
    evmAddress: string,
    asset: IBlockscoutAsset,
    evmNetwork: IEvmNetwork
): Promise<void> {
    const { token, value } = asset
    const { address, name, symbol } = token
    try {
        const contract = evmNetwork.getContract(ERC721_ABI, address)
        const networkId = evmNetwork.id

        const nftPromises = Array.from({ length: Number(value) }).map(async (_, idx) => {
            try {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call<string>()
                const persistedNft = await persistNftWithContractMetadata(
                    evmAddress,
                    networkId,
                    {
                        standard: NftStandard.Erc721,
                        address,
                        name,
                        symbol,
                    },
                    tokenId,
                    contract
                )
                if (!persistedNft) {
                    return undefined
                }

                addNewTrackedNftToActiveProfile(networkId, persistedNft.id, TokenTrackingStatus.AutomaticallyTracked)

                const nft = buildNftFromPersistedErc721Nft(persistedNft, evmAddress)
                addOrUpdateNftForAccount(account.index, nft)
                return nft
            } catch (err) {
                // If we don't have the tokenId we cannot persist the NFT. ERC-721 contracts should implement
                // the ERC-165 interface to support `tokenOfOwnerByIndex`
                // https://stackoverflow.com/questions/69302924/erc-721-how-to-get-all-token-ids
            }
        })

        const nfts = (await Promise.all(nftPromises)).filter(Boolean) as Nft[]
        await addNftsToDownloadQueue(nfts)
    } catch (err) {
        console.error(err)
        throw new Error(`Unable to persist NFT with address ${address}`)
    }
}
