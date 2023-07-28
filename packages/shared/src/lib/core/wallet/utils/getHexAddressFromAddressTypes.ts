import { Address, AddressType } from '@iota/sdk/out/types/block/address'

export function getHexAddressFromAddressTypes(address: Address): string | undefined {
    switch (address?.type) {
        case AddressType.Ed25519:
            return address.pubKeyHash
        case AddressType.Alias:
            return address.aliasId
        case AddressType.Nft:
            return address.nftId
    }
}
