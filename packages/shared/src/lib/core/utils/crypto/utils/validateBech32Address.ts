import { Bech32 } from '@iota/crypto.js'

import { localize } from '@core/i18n'
import { ADDRESS_TYPE_MAP } from '@core/wallet/constants'
import { AddressType } from '@iota/sdk/out/types'

export function validateBech32Address(prefix: string, addr: string, addressType?: AddressType): void {
    if (!addr || !addr.startsWith(prefix)) {
        throw new Error(
            localize('error.send.wrongAddressPrefix', {
                values: {
                    prefix: prefix,
                },
            })
        )
    }
    // eslint-disable-next-line security/detect-non-literal-regexp
    if (!new RegExp(`^${prefix}1[02-9ac-hj-np-z]{59}$`).test(addr)) {
        throw new Error(localize('error.send.wrongAddressFormat'))
    }

    const addressTypeLetter = addressType === undefined ? undefined : ADDRESS_TYPE_MAP[addressType]
    // eslint-disable-next-line security/detect-non-literal-regexp
    if (addressTypeLetter && !new RegExp(`^${prefix}1${addressTypeLetter}[02-9ac-hj-np-z]{58}$`).test(addr)) {
        throw new Error(localize('error.address.wrongAddressType'))
    }

    let isValid = false
    try {
        const decoded = Bech32.decode(addr)
        isValid = !!decoded && decoded.humanReadablePart === prefix
    } catch (err) {
        throw new Error(localize('error.crypto.cannotDecodeBech32'))
    }

    if (!isValid) {
        throw new Error(localize('error.send.invalidAddress'))
    }
}
