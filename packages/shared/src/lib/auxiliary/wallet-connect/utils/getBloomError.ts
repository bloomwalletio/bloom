import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { IError } from '@core/error/interfaces'

export function getBloomError(err: unknown): Omit<CallbackParameters, 'result'> {
    return {
        error: {
            message: (err as IError).message ?? 'Something went wrong',
            code: 1000,
        },
    }
}
