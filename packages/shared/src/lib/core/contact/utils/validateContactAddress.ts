import { localize } from '@core/i18n'
import { IValidationOptions } from '@core/utils/interfaces'
import { isAccountAddress, validateAddressFormatForNetwork } from '@core/account/actions'
import { ContactManager } from '../classes'
import { NetworkId } from '@core/network'

export function validateContactAddress(options: IValidationOptions, networkId: NetworkId): void {
    const { isRequired, mustBeUnique } = options

    const address = options?.value as string
    if (isRequired && !address) {
        throw new Error(localize('error.input.required', { field: localize('general.address') }))
    }

    validateAddressFormatForNetwork(address, networkId)

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
