import { Platform } from '@core/app/classes'

import { isDeepLinkRequestActive } from '../stores'

export function resetDeepLink(): void {
    Platform.DeepLinkManager?.clearDeepLinkRequest()
    isDeepLinkRequestActive.set(false)
}
