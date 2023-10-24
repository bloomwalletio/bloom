import { ErrorType } from '@core/error/enums'
import { Error } from '@core/error/types'
import { parseWalletError } from './parseWalletError'
import { BaseError } from '@core/error/classes'

export function parseError(
    err: { type?: string; message: string } | { type?: string; cause: string } | { type?: string; error: string }
): Error {
    const message = err.message || err.cause || err.error || 'Unknown Error'
    switch (err.type) {
        case ErrorType.Wallet:
            return parseWalletError(message)
        default:
            return new BaseError({ type: ErrorType.Unknown, error: 'Unknown', message })
    }
}
