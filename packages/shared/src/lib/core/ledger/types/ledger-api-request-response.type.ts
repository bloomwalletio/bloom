import type { IEvmAddress, IEvmTransactionSignature } from '@core/layer-2/interfaces'
import { ILedgerEthereumAppSettings } from '../interfaces'

export type LedgerApiRequestResponse = ILedgerEthereumAppSettings | IEvmAddress | IEvmTransactionSignature
