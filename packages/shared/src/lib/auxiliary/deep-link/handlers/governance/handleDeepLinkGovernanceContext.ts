import { localize } from '@core/i18n'
import { GovernanceOperation } from '../../enums'
import { handleDeepLinkAddProposalOperation } from './operations'

export function handleDeepLinkGovernanceContext(
    pathnameParts: GovernanceOperation,
    searchParams: URLSearchParams
): void {
    switch (pathnameParts) {
        case GovernanceOperation.AddProposal:
            handleDeepLinkAddProposalOperation(searchParams)
            break
        default: {
            throw new Error(
                localize('notifications.deepLinkingRequest.governance.unrecognizedOperation', {
                    values: { operation: pathnameParts },
                })
            )
        }
    }
}
