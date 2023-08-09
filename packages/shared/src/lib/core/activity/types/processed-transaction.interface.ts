import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection, InclusionState } from '../enums'
import { IUTXOInput } from '@iota/types'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: IUTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}
