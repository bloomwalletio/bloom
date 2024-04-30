import { get } from 'svelte/store'
import { getActiveProfile } from '@core/profile/stores'
import { NftStandard } from '../enums'
import { IPersistedErc721Nft } from '../interfaces'
import { persistedNfts } from '../stores'
import { NetworkId } from '@core/network'

export function getPersistedErc721NftsForNetwork(networkId: NetworkId): IPersistedErc721Nft[] {
    const activeProfileId = getActiveProfile()?.id
    if (activeProfileId) {
        const profileNfts = Object.values(get(persistedNfts)[activeProfileId] ?? {})
        return profileNfts.filter(
            ({ standard, networkId: _networkId }) => standard === NftStandard.Erc721 && networkId === networkId
        ) as IPersistedErc721Nft[]
    } else {
        throw new Error('Unable to get active profile')
    }
}
