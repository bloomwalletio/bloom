import { Common } from '@ethereumjs/common'
import { TxOptions } from '@ethereumjs/tx'

import { EvmChainId } from '@core/network/enums'

export const DEFAULT_EVM_TRANSACTION_OPTIONS: TxOptions = {
    common: Common.custom({ chainId: Number(EvmChainId.ShimmerEvmTestnet) }),
}
