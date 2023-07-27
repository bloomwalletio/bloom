import { IEvmAddress } from '@core/app/interfaces'
import { IEvmTransactionSignature } from '@core/layer-2/interfaces'

export type LedgerApiRequestResponse = IEvmAddress | IEvmTransactionSignature
