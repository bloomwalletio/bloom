import { removeEvmNetworkFromActiveProfile } from '@core/profile/stores'
import { IEvmNetwork } from '..'
import { removeEvmNetworkFromNetworks } from '../stores'

export function removeExistingEvmNetwork(evmNetwork: IEvmNetwork): void {
    evmNetwork.destroy()
    removeEvmNetworkFromNetworks(evmNetwork.id)
    removeEvmNetworkFromActiveProfile(evmNetwork.id)
}
