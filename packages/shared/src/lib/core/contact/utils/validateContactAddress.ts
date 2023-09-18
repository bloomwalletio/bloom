import { isAccountAddress, isValidAddressFormatForNetwork } from '@core/account/actions'
import { localize } from '@core/i18n'
import { NetworkId } from '@core/network'
import { IValidationOptions } from '@core/utils/interfaces'
import { ContactManager } from '../classes'

export function validateContactAddress(options: IValidationOptions, networkId: NetworkId): void {
    const { isRequired, mustBeUnique } = options

    const address = options?.value as string
    if (isRequired && !address) {
        throw new Error(localize('error.input.required', { field: localize('general.address') }))
    }

    const addressFormatError = isValidAddressFormatForNetwork(address, networkId)
    if (addressFormatError) {
        throw new Error(addressFormatError)
    }

    if (isAccountAddress(address, networkId)) {
        throw new Error(localize('error.address.belongsToAccount'))
    }

    if (mustBeUnique) {
        const isAlreadyBeingUsed = ContactManager.listContactAddressesForNetwork(networkId).some(
            (contactAddress) => contactAddress.address === address
        )
        if (isAlreadyBeingUsed) {
            throw new Error(localize('error.input.alreadyUsed', { field: localize('general.address') }))
        }
    }
}
