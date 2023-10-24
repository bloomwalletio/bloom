import { ErrorType, WalletError } from '../enums'
import { IBaseError } from './base-error.interface'

export interface IWalletError extends Omit<IBaseError, 'type' | 'error'> {
    type: ErrorType.Wallet
    error: WalletError
}
