import { IPureEvmNetworkConfiguration } from '../interfaces'
import { BaseEvmNetwork } from './base-evm-network.class'

export class EvmNetwork extends BaseEvmNetwork {
    constructor(chainConfiguration: IPureEvmNetworkConfiguration) {
        try {
            super(chainConfiguration)
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct isc Chain!')
        }
    }
}
