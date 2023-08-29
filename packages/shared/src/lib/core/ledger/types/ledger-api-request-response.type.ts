import type { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import type { IGetEthereumAppSettingsResponse } from '@core/ledger/interfaces'

export type LedgerApiRequestResponse = IEvmAddress | IEvmTransactionSignature | IGetEthereumAppSettingsResponse
