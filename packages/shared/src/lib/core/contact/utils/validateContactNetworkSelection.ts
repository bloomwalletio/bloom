import { localize } from '@core/i18n'
import { NetworkId } from '@core/network'

export function validateContactNetworkSelection(networkId: NetworkId | undefined): void {
    if (!networkId) {
        throw new Error(localize('error.input.invalid', { field: localize('general.networkSelection') }))
    }
}
