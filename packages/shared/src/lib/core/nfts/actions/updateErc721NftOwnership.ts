import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { updateAllAccountNftsForAccount } from './updateAllAccountNfts'
import { NftStandard } from '../enums'
import { IErc721Nft } from '../interfaces'
import { getAllAccountNfts, persistedNftForActiveProfile, updatePersistedNft } from '../stores'
import { getOwnerOfErc721Nft } from '../utils'
import { get } from 'svelte/store'
import { NetworkId } from '@core/network'

export async function updateErc721NftsOwnership(account: IAccountState, networkId: NetworkId): Promise<void> {
    try {
        const trackedErc721Nfts =
            (getAllAccountNfts()[account.index]?.filter((nft) => {
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
            updateAllAccountNftsForAccount(account.index, { ...nft, isSpendable })
        })
        await Promise.allSettled(promises)
    } catch (error) {
        console.error(error)
    }
}
