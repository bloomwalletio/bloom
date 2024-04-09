import { NetworkNamespace } from '@core/network/enums'
import { BaseActivity } from '../base-activity.type'
import { ISmartContractSubject } from '@core/wallet'

export type BaseEvmActivity = BaseActivity & {
    namespace: NetworkNamespace.Evm

    contract?: ISmartContractSubject
    estimatedGasFee?: bigint
    maxGasFee?: bigint
    transactionFee?: bigint
}
