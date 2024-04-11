import { NetworkNamespace } from '@core/network/enums'
import { BaseActivity } from '../base-activity.type'
import { ISmartContractSubject } from '@core/wallet'
import { EvmNetworkId } from '@core/network'

export type BaseEvmActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    sourceNetworkId: EvmNetworkId
    contract?: ISmartContractSubject
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
