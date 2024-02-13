import { localize } from '@core/i18n'
import { DappsOperation } from '../../enums'
import { handleDeepLinkAddWCConnectionOperation } from './operations'

export function handleDeepLinkDappsContext(pathnameParts: DappsOperation, searchParams: URLSearchParams): void {
    switch (pathnameParts) {
        case DappsOperation.Connect:
        case DappsOperation.Wc:
            handleDeepLinkAddWCConnectionOperation(searchParams)
            break
        default: {
            throw new Error(
                localize('notifications.deepLinkingRequest.dapps.unrecognizedOperation', {
                    values: { operation: pathnameParts },
                })
            )
        }
    }
}
