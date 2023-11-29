import { IAccountState } from '@core/account/interfaces'
import { ContractType, Erc721InterfaceId } from '@core/layer-2/enums'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'

import { NftStandard } from '../enums'
import { IErc721Metadata, INftInstance } from '../interfaces'
import { addPersistedNft } from '../stores'
import { buildPersistedNftFromNftMetadata } from '../utils'
import { isNftPersisted } from './isNftPersisted'

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

        const explorerNfts = await explorerApi.getAssetsForAddress(evmAddress, NftStandard.Erc721)
        for (const explorerNft of explorerNfts) {
            const { token, value } = explorerNft
            const { address, name, symbol } = token
            const nftMetadata: IErc721Metadata = {
                standard: NftStandard.Erc721,
                address,
                name,
                symbol,
            }

            const contract = chain.getContract(ContractType.Erc721, address)
            const isEnumerable = await contract.methods.supportsInterface(Erc721InterfaceId.Enumerable).call()

            const instances: INftInstance[] = []
            if (isEnumerable) {
                for (let idx = 0; idx < value; idx++) {
                    const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call()
                    if (isNftPersisted(address, tokenId)) {
                        continue
                    }

                    const instance = {
                        tokenId,
                    } as INftInstance

                    const hasMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
                    if (hasMetadata) {
                        const tokenUri = await contract.methods.tokenURI(tokenId).call()
                        const response = await fetch(tokenUri)
                        const metadata = await response.json()
                        if (metadata) {
                            instance.data = metadata
                        }
                    }
                    instances.push(instance)
                }
            } else {
                const instance = {
                    tokenId: '0',
                } as INftInstance

                const hasMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
                if (hasMetadata) {
                    const tokenUri = await contract.methods.tokenURI('0').call()
                    const response = await fetch(tokenUri)
                    const metadata = await response.json()
                    if (metadata) {
                        instance.data = metadata
                    }
                }
                instances.push(instance)
            }

            if (!isNftPersisted(address)) {
                addPersistedNft(address, {
                    ...buildPersistedNftFromNftMetadata(nftMetadata),
                    instances,
                })
            }
        }
    })
}
