import { CallbackParameters } from '@auxiliary/wallet-connect/types'
import { getSdkError } from '@walletconnect/utils'
import { IError } from '@core/error/interfaces'

export function getBloomError(err: unknown): Omit<CallbackParameters, 'result'> {
    try {
        // @ts-expect-error the error types aren't exported from @walletconnect
        return { error: getSdkError(err) }
    } catch {
        return {
            error: {
                message: (err as IError).message ?? 'Something went wrong',
                code: 1000,
            },
        }
    }
}
