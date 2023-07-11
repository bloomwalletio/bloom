import { DestinationNetwork } from '@core/layer-2/enums'

export function validateContactNetworkSelection(networkId: string): void {
    if (!networkId || !Object.values(DestinationNetwork).includes(networkId)) {
        throw new Error('Invalid network selection input')
    }
}
