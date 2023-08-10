import { Common } from '@ethereumjs/common'
import { EvmTransactionOptions } from '@core/layer-2'
import { EvmChainId } from '@core/network'

export function getEvmTransactionOptions(chainId: EvmChainId): EvmTransactionOptions {
    return {
        common: Common.custom({
            chainId,
        }),
    }
}
