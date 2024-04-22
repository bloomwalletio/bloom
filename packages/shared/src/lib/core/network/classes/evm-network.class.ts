import { IPureEvmNetworkConfiguration } from '../interfaces'
import { BaseEvmNetwork } from './base-evm-network.class'

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
