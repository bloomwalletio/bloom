import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { NftStandard } from '../enums'
import { IErc721Nft } from '../interfaces'
import {
    addOrUpdateNftForAccount,
    getNftsForAccount,
    persistedNftForActiveProfile,
    removeNftFromCollections,
    updatePersistedNft,
} from '../stores'
import { getOwnerOfErc721Nft } from '../utils'
import { get } from 'svelte/store'
import { NetworkId } from '@core/network'
import { persistAndUpdateCollections } from './persistAndUpdateCollections'

export async function updateErc721NftsOwnership(account: IAccountState, networkId: NetworkId): Promise<void> {
    try {
        const trackedErc721Nfts =
            (getNftsForAccount(account.index)?.filter((nft) => {
                return nft.standard === NftStandard.Erc721 && nft.networkId === networkId
            }) as IErc721Nft[]) ?? []
        const promises = trackedErc721Nfts.map(async (nft) => {
            const updatedOwner = await getOwnerOfErc721Nft(nft)
            const persistedNft = get(persistedNftForActiveProfile)?.[nft.id]
            if (!persistedNft) {
                return
            }

            if (persistedNft.ownerAddress !== updatedOwner) {
                updatePersistedNft(nft.id, { ownerAddress: updatedOwner })
            }
            const l2Address = getAddressFromAccountForNetwork(account, nft.networkId)
            const isSpendable = updatedOwner === l2Address?.toLowerCase()
            addOrUpdateNftForAccount(account.index, { ...nft, isSpendable })
            if (isSpendable) {
                await persistAndUpdateCollections(account.index, [nft])
            } else {
                removeNftFromCollections(account.index, nft.id)
            }
        })
        await Promise.allSettled(promises)
    } catch (error) {
        console.error(error)
    }
}
