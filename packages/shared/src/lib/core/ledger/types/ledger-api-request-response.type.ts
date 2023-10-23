import type { IEvmAddress, IEvmSignature } from '@core/layer-2/interfaces'
import { ILedgerEthereumAppSettings } from '../interfaces'

export type LedgerApiRequestResponse = ILedgerEthereumAppSettings | IEvmAddress | IEvmSignature
