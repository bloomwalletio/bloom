import { IContactAddressMap } from '@core/contact'
import { isEvmNetwork, NetworkId, SupportedNetworkId } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function migrateEvmContacts(profile: IPersistedProfile): void {
    const evmNetworks = Object.keys(profile.networkContactAddresses).filter((networkId) =>
        isEvmNetwork(networkId as NetworkId)
    )

    const migratedContacts: IContactAddressMap = structuredClone(
        profile.networkContactAddresses[SupportedNetworkId.GenericEvm] ?? {}
    )

    evmNetworks.forEach((network) => {
        const networkContacts: IContactAddressMap = profile.networkContactAddresses[network] ?? {}
        Object.entries(networkContacts).forEach(([address, contactAddress]) => {
            migratedContacts[address] = contactAddress
        })
        delete profile.networkContactAddresses[network]
    })

    profile.networkContactAddresses[SupportedNetworkId.GenericEvm] = migratedContacts
}
