import { AddressType } from '@iota/sdk/out/types/block/address'
import { ADDRESS_LETTER_ALIAS, ADDRESS_LETTER_ED25519, ADDRESS_LETTER_NFT } from './address-letter.constants'

export const ADDRESS_TYPE_MAP = {
    [AddressType.Ed25519]: ADDRESS_LETTER_ED25519,
    [AddressType.Alias]: ADDRESS_LETTER_ALIAS,
    [AddressType.Nft]: ADDRESS_LETTER_NFT,
}
