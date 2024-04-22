import { BaseEvmNetwork } from '@core/network/classes/base-evm-network.class'
import { IPureEvmNetworkConfiguration } from '@core/network/interfaces'

export class EvmNetwork extends BaseEvmNetwork {
    public readonly symbol: string

    constructor(chainConfiguration: IPureEvmNetworkConfiguration) {
        try {
            super(chainConfiguration)
            this.symbol = chainConfiguration.symbol
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct isc Chain!')
        }
    }
}
