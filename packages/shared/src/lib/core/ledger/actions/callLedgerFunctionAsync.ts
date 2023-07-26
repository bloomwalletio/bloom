import { IPlatformEventMap, Platform } from '@core/app'
import { localize } from '@core/i18n'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

export async function callLedgerFunctionAsync<T>(
    ledgerFunction: () => void,
    returnEvent: keyof IPlatformEventMap
): Promise<T> {
    const POLLING_INTERVAL = 100
    const TIMEOUT_IN_SECONDS = 60
    const LOOP_ITERATIONS = (TIMEOUT_IN_SECONDS * MILLISECONDS_PER_SECOND) / POLLING_INTERVAL

    ledgerFunction()

    let isGenerating = true
    let returnValue: T | undefined = undefined

    Platform.onEvent(returnEvent, (value) => {
        isGenerating = false
        returnValue = <T>value
    })

    for (let count = 0; count < LOOP_ITERATIONS; count++) {
        if (!isGenerating) {
            if (returnValue && Object.keys(returnValue).length !== 0) {
                return Promise.resolve(returnValue)
            } else {
                return Promise.reject('Signing was rejected by the Ledger device')
            }
        }
        await sleep(POLLING_INTERVAL)
    }
    return Promise.reject(localize('error.ledger.timeout'))
}
