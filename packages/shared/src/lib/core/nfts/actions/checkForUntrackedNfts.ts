import { IAccountState } from '@core/account/interfaces'
import { ContractType } from '@core/layer-2/enums'
import { EvmExplorerApi } from '@core/network/classes'
import { getNetwork } from '@core/network/stores'
import { IChain, IExplorerAsset } from '@core/network/interfaces'

import { NftStandard } from '../enums'
import { persistNftWithContractMetadata } from './persistNftWithContractMetadata'

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
            void persistNftsFromExplorerAsset(evmAddress, explorerNft, chain)
        }
    })
}

async function persistNftsFromExplorerAsset(evmAddress: string, asset: IExplorerAsset, chain: IChain): Promise<void> {
    const { token, value } = asset
    const { address, name, symbol } = token
    try {
        const contract = chain.getContract(ContractType.Erc721, address)

        await Promise.all(
            Array.from({ length: Number(value) }).map(async (_, idx) => {
                try {
                    const tokenId = await contract.methods.tokenOfOwnerByIndex(evmAddress, idx).call()
                    await persistNftWithContractMetadata(
                        evmAddress,
                        chain.getConfiguration().id,
                        {
                            standard: NftStandard.Erc721,
                            address,
                            name,
                            symbol,
                        },
                        tokenId,
                        contract
                    )
                } catch (err) {
                    // If we don't have the tokenId we cannot persist the NFT. ERC-721 contracts should implement
                    // the ERC-165 interface to support `tokenOfOwnerByIndex`
                    // https://stackoverflow.com/questions/69302924/erc-721-how-to-get-all-token-ids
                }
            })
        )
    } catch (err) {
        console.error(err)
        throw new Error(`Unable to persist NFT with address ${address}`)
    }
}
