import { localize } from '@core/i18n'
import { DappsOperation } from '../../enums'
import { handleDeepLinkAddWCConnectionOperation } from './operations'

export function handleDeepLinkDappsContext(pathnameParts: string[], searchParams: URLSearchParams): void {
    switch (pathnameParts[0]) {
        case DappsOperation.Connect:
        case DappsOperation.Wc:
            handleDeepLinkAddWCConnectionOperation(searchParams)
            break
        default: {
            throw new Error(
                localize('notifications.deepLinkingRequest.dapps.unrecognizedOperation', {
                    values: { operation: pathnameParts[0] },
                })
            )
        }
    }
}
