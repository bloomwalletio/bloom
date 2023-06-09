import { ADDRESS_LETTER_ALIAS, ADDRESS_LETTER_ED25519, ADDRESS_LETTER_NFT } from './address-letter.constants'
import { ADDRESS_TYPE_ALIAS, ADDRESS_TYPE_ED25519, ADDRESS_TYPE_NFT } from './address-type.constants'

export const ADDRESS_TYPE_MAP = {
    [ADDRESS_TYPE_ED25519]: ADDRESS_LETTER_ED25519,
    [ADDRESS_TYPE_ALIAS]: ADDRESS_LETTER_ALIAS,
    [ADDRESS_TYPE_NFT]: ADDRESS_LETTER_NFT,
}
