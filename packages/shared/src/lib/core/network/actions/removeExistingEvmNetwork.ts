import { removeEvmNetworkFromActiveProfile } from '@core/profile/stores'
import { IEvmNetwork } from '..'
import { removeEvmNetworkFromNetworks } from '../stores'
import { removeAllActivitiesForNetworkId } from '@core/activity'
import { removeAllNftsForNetworkId } from '@core/nfts/stores'

export function removeExistingEvmNetwork(evmNetwork: IEvmNetwork): void {
    evmNetwork.destroy()
    removeEvmNetworkFromNetworks(evmNetwork.id)
    removeEvmNetworkFromActiveProfile(evmNetwork.id)

    removeAllActivitiesForNetworkId(evmNetwork.id)
    removeAllNftsForNetworkId(evmNetwork.id)
}
