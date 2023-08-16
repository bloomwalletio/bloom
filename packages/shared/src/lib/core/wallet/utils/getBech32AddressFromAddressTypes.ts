import { Address, AddressType } from '@iota/sdk/out/types'

import { convertHexAddressToBech32 } from './convertHexAddressToBech32'

export function getBech32AddressFromAddressTypes(address: Address): string | undefined {
    switch (address?.type) {
        case AddressType.Ed25519:
            return convertHexAddressToBech32(AddressType.Ed25519, address.pubKeyHash)
        case AddressType.Alias:
            return convertHexAddressToBech32(AddressType.Alias, address.aliasId)
        case AddressType.Nft:
            return convertHexAddressToBech32(AddressType.Nft, address.nftId)
    }
}
