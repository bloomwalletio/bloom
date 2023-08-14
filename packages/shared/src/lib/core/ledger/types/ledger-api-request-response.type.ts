import type { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import type { ILedgerEthereumAppSettings } from '@core/ledger/interfaces'

export type LedgerApiRequestResponse = IEvmAddress | IEvmTransactionSignature | ILedgerEthereumAppSettings
