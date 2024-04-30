import { NetworkType } from '../enums'
import { IEvmNetwork, IPureEvmNetworkConfiguration } from '../interfaces'
import { BaseEvmNetwork } from './base-evm-network.class'

export class EvmNetwork extends BaseEvmNetwork implements IEvmNetwork {
    public readonly type = NetworkType.Evm

    constructor(chainConfiguration: IPureEvmNetworkConfiguration) {
        super(chainConfiguration)
    }
}
