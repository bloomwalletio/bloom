import { WALLET_ERROR_LOCALE } from '../constants'
import { ErrorType, WalletError } from '../enums'
import { IWalletError } from '../interfaces'
import { BaseError } from './base-error.class'

export class CWalletError extends BaseError implements IWalletError {
    type: ErrorType.Wallet
    error: WalletError
    locale?: string

    constructor(error: WalletError, message: string) {
        super({ type: ErrorType.Wallet, error, message })
        this.type = ErrorType.Wallet
        this.error = error
        this.locale = `error.wallet.${WALLET_ERROR_LOCALE[error]}`
    }
}
