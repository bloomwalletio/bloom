import { ActivityDirection, InclusionState } from '../enums'
import { UTXOInput } from '@iota/sdk/out/types'
import { IWrappedOutput } from '@core/wallet/interfaces'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: UTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
