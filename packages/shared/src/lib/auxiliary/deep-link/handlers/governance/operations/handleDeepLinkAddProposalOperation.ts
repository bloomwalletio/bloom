import { showNotification } from '@auxiliary/notification/actions'
import { closePopup, openPopup, PopupId } from '../../../../../../../../desktop/lib/auxiliary/popup'
import { isValidUrl } from '@core/utils/validation'
import { isProposalAlreadyAddedForSelectedAccount, isValidProposalId } from '@contexts/governance/utils'
import { AddProposalOperationParameter } from '../../../enums'
import { registeredProposalsForSelectedAccount, selectedProposalId } from '@contexts/governance/stores'
import { GovernanceRoute, governanceRouter } from '@core/router'
import { get } from 'svelte/store'

/**
 * NOTE: If we throw an error as normal, it will be handled and displayed in the "failed link"
 * popup.
 */
export function handleDeepLinkAddProposalOperation(searchParams: URLSearchParams): void {
    const initialEventId = searchParams.get(AddProposalOperationParameter.EventId)
    if (!initialEventId || !isValidProposalId(initialEventId)) {
        throw new Error('Invalid proposal ID')
    } else if (isProposalAlreadyAddedForSelectedAccount(initialEventId)) {
        const proposal = get(registeredProposalsForSelectedAccount)[initialEventId]
        if (proposal === undefined) {
            throw new Error(`Event with id ${initialEventId} not found`)
        } else {
            selectedProposalId.set(initialEventId)
            get(governanceRouter)?.goTo(GovernanceRoute.Details)

            showNotification({
                variant: 'warning',
                text: 'This proposal has already been added',
            })
            closePopup()
            return
        }
    }

    const initialNodeUrl = searchParams.get(AddProposalOperationParameter.NodeUrl)
    if (!initialNodeUrl || !isValidUrl(initialNodeUrl)) {
        throw new Error('Invalid node URL')
    }

    openPopup({
        id: PopupId.AddProposal,
        props: { initialEventId, initialNodeUrl },
    })
}
