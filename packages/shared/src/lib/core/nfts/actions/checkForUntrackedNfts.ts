import { IAccountState } from '@core/account/interfaces'
import { ContractType, Erc721InterfaceId } from '@core/layer-2/enums'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'
import { TokenTrackingStatus } from '@core/token/enums'

import { DEFAULT_NFT_TOKEN_ID } from '../constants'
import { NftStandard } from '../enums'
import { IErc721ContractMetadata } from '../interfaces'
import { addPersistedNft } from '../stores'
import { getPersistedErc721NftFromContract } from '../utils'
import { addNewTrackedNftToActiveProfile } from './addNewTrackedNftToActiveProfile'
import { isNftPersisted } from './isNftPersisted'
import { Contract } from '@core/layer-2'
import { IExplorerAssetMetadata } from '@core/network'

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
            try {
                const { token, value } = explorerNft
                const { address } = token
                const contract = chain.getContract(ContractType.Erc721, address)

                const isEnumerable = await contract.methods.supportsInterface(Erc721InterfaceId.Enumerable).call()
                if (isEnumerable) {
                    await Promise.all(
                        Array.from({ length: Number(value) }).map(async (_, idx) => {
                            const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call()
                            await persistNft(token, tokenId, contract)
                        })
                    )
                } else {
                    await persistNft(token, DEFAULT_NFT_TOKEN_ID, contract)
                }

                addNewTrackedNftToActiveProfile(networkId, address, TokenTrackingStatus.AutomaticallyTracked)
            } catch (err) {
                throw new Error(`Unable to persist NFT with address ${explorerNft.token.address}`)
            }
        }
    })
}

async function persistNft(token: IExplorerAssetMetadata, tokenId: string, contract: Contract): Promise<void> {
    const { address, name, symbol } = token
    if (isNftPersisted(address, tokenId)) {
        return
    }

    const contractMetadata: IErc721ContractMetadata = {
        standard: NftStandard.Erc721,
        address,
        name,
        symbol,
    }
    addPersistedNft(
        `${address}:${tokenId}`,
        await getPersistedErc721NftFromContract(tokenId, contract, contractMetadata)
    )
}
