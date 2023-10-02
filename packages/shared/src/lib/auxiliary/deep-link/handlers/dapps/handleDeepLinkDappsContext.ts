import { localize } from '@core/i18n'
import { DappsOperation } from '../../enums'
import { handleDeepLinkAddWCConnectionOperation } from './operations'

export function handleDeepLinkDappsContext(pathnameParts: string[], searchString: string): void {
    switch (pathnameParts[0]) {
        case DappsOperation.ConnectWithWC:
            handleDeepLinkAddWCConnectionOperation(pathnameParts, searchString)
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
