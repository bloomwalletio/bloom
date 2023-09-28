import { localize } from '@core/i18n'
import { WalletOperation } from '../../enums'
import { handleDeepLinkSendConfirmationOperation, handleDeepLinkSendFormOperation } from './operations'

/**
 * Parses a deep link within the wallet context.
 *
 * @method parseWalletDeepLinkRequest
 *
 * @param {URL} url The URL that was opened by the user.
 *
 * @return {void} The formatted content of a deep link request within the wallet context.
 */
export function handleDeepLinkWalletContext(pathnameParts: string[], searchParams: URLSearchParams): void {
    switch (pathnameParts[0]) {
        case WalletOperation.SendForm:
            handleDeepLinkSendFormOperation(searchParams)
            break
        case WalletOperation.SendConfirmation:
            handleDeepLinkSendConfirmationOperation(searchParams)
            break
        default: {
            throw new Error(
                localize('notifications.deepLinkingRequest.wallet.unrecognizedOperation', {
                    values: { operation: pathnameParts[0] },
                })
            )
        }
    }
}
