import { IAccountState } from '@core/account/interfaces'
import { ContractType, Erc721InterfaceId } from '@core/layer-2/enums'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'
import { TokenTrackingStatus } from '@core/token/enums'

import { NftStandard } from '../enums'
import {
    IErc721ContractMetadata,
    IErc721TokenMetadata,
    IErc721TokenMetadataAttribute,
    IPersistedErc721Nft,
} from '../interfaces'
import { composeUrlFromNftUri } from '../utils'
import { addNewTrackedNftToActiveProfile } from './addNewTrackedNftToActiveProfile'

export function checkForUntrackedNfts(account: IAccountState): void {
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const coinType = chain.getConfiguration().coinType
        const evmAddress = account.evmAddresses[coinType]
        if (!evmAddress) {
            return
        }
        const networkId = chain.getConfiguration().id
        const explorerApi = new EvmExplorerApi(networkId)

        const explorerNfts = await explorerApi.getAssetsForAddress<NftStandard.Erc721>(evmAddress, NftStandard.Erc721)
        for (const explorerNft of explorerNfts) {
            const { token, value } = explorerNft
            const { address, name, symbol } = token

            addNewTrackedNftToActiveProfile(networkId, address, TokenTrackingStatus.AutomaticallyTracked)

            const contractMetadata: IErc721ContractMetadata = {
                standard: NftStandard.Erc721,
                address,
                name,
                symbol,
            }

            const contract = chain.getContract(ContractType.Erc721, address)
            const isEnumerable = await contract.methods.supportsInterface(Erc721InterfaceId.Enumerable).call()

            if (isEnumerable) {
                for (let idx = 0; idx < Number(value); idx++) {
                    const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call()
                    const persistedNft: IPersistedErc721Nft = {
                        standard: NftStandard.Erc721,
                        contractMetadata,
                        tokenId,
                    }

                    const hasTokenMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
                    if (hasTokenMetadata) {
                        const tokenUri = await contract.methods.tokenURI(tokenId).call()
                        const composedTokenUri = composeUrlFromNftUri(tokenUri)
                        persistedNft.tokenUri = composedTokenUri

                        const response = await fetch(composedTokenUri)
                        const metadata = (await response.json()) as IErc721TokenMetadata
                        if (metadata) {
                            const attributes: IErc721TokenMetadataAttribute[] = metadata.attributes?.map(
                                (attribute) => ({ traitType: attribute['trait_type'], value: attribute.value })
                            )
                            persistedNft.tokenMetadata = {
                                ...metadata,
                                image: composeUrlFromNftUri(metadata.image) ?? metadata.image,
                                attributes,
                            }
                        }
                    }
                }
            } else {
                const tokenId = '0'
                const persistedNft: IPersistedErc721Nft = {
                    standard: NftStandard.Erc721,
                    contractMetadata,
                    tokenId,
                }

                const hasTokenMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
                if (hasTokenMetadata) {
                    const tokenUri = await contract.methods.tokenURI('0').call()
                    persistedNft.tokenUri = tokenUri

                    const response = await fetch(tokenUri)
                    const metadata = (await response.json()) as IErc721TokenMetadata
                    if (metadata) {
                        const attributes: IErc721TokenMetadataAttribute[] = metadata.attributes?.map((attribute) => ({
                            traitType: attribute['trait_type'],
                            value: attribute.value,
                        }))
                        persistedNft.tokenMetadata = {
                            ...metadata,
                            attributes,
                        }
                    }
                }
            }
        }
    })
}
