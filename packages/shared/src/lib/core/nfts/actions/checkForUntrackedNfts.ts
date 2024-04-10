import { IAccountState } from '@core/account/interfaces'
import { ContractType } from '@core/layer-2/enums'
import { getNetwork } from '@core/network/stores'
import { IChain } from '@core/network/interfaces'
import features from '@features/features'

import { NftStandard } from '../enums'
import { persistNftWithContractMetadata } from './persistNftWithContractMetadata'
import { updateAllAccountNftsForAccount } from './updateAllAccountNfts'
import { buildNftFromPersistedErc721Nft } from '../utils'
import { addNftsToDownloadQueue } from './addNftsToDownloadQueue'
import { Nft } from '../interfaces'
import { addNewTrackedNftToActiveProfile } from './addNewTrackedNftToActiveProfile'
import { TokenTrackingStatus } from '@core/token'
import { IBlockscoutAsset } from '@auxiliary/blockscout/interfaces'
import { BlockscoutApi } from '@auxiliary/blockscout/api'

export async function checkForUntrackedNfts(account: IAccountState): Promise<void> {
    if (!features?.collectibles?.erc721?.enabled) {
        return
    }

    const chains = getNetwork()?.getChains() ?? []

    for (const chain of chains) {
        const evmAddress = account.evmAddresses[chain.coinType]
        if (!evmAddress) {
            return
        }
        const blockscoutApi = new BlockscoutApi(chain.id)

        const explorerNfts = await blockscoutApi.getAssetsForAddress(evmAddress, NftStandard.Erc721)
        for (const explorerNft of explorerNfts) {
            await persistNftsFromExplorerAsset(account, evmAddress, explorerNft, chain)
        }
    }
}

async function persistNftsFromExplorerAsset(
    account: IAccountState,
    evmAddress: string,
    asset: IBlockscoutAsset,
    chain: IChain
): Promise<void> {
    const { token, value } = asset
    const { address, name, symbol } = token
    try {
        const contract = chain.getContract(ContractType.Erc721, address)
        const networkId = chain.id

        const nftPromises = Array.from({ length: Number(value) }).map(async (_, idx) => {
            try {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call()
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
                updateAllAccountNftsForAccount(account.index, nft)
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
