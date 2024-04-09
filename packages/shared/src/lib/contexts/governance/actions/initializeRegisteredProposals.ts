import { get } from 'svelte/store'

import { getSelectedAccount } from '@core/account/stores'
import { IAccountState } from '@core/account/interfaces'
import { activeAccounts } from '@core/profile/stores'

import { IRegisteredProposals } from '../interfaces'
import { registeredProposals } from '../stores'
import { createProposalFromError, createProposalFromEvent } from '../utils'
import { getAccountsParticipationEventStatusForEvent } from './getAccountsParticipationEventStatusForEvent'

export async function initializeRegisteredProposals(): Promise<void> {
    try {
        const allProposals: { [accountId: number]: IRegisteredProposals } = {}

        // Get selected account first to speed up showing proposals for the user
        const selectedAccount = getSelectedAccount()
        allProposals[selectedAccount.index] = await getParticipationEventsAndCreateProposalsForAccount(selectedAccount)
        registeredProposals.set(allProposals)

        // Then get the rest of the accounts in the background
        for (const account of get(activeAccounts)) {
            // Break out of the loop if the profile was logged out
            try {
                getSelectedAccount()
            } catch (_) {
                break
            }

            if (account.index !== selectedAccount.index) {
                allProposals[account.index] = await getParticipationEventsAndCreateProposalsForAccount(account)
            }
        }
        registeredProposals.set(allProposals)
    } catch (err) {
        console.error(err)
    }
}

async function getParticipationEventsAndCreateProposalsForAccount(
    account: IAccountState
): Promise<IRegisteredProposals> {
    const proposals: IRegisteredProposals = {}
    const events = await account.getParticipationEvents()
    for (const event of Object.values(events)) {
        // Test whether selected account is still set
        try {
            getSelectedAccount()
        } catch (_) {
            break
        }

        const proposal = createProposalFromEvent(event)
        try {
            await getAccountsParticipationEventStatusForEvent(event.id, account)
            proposals[event.id] = proposal
        } catch (err) {
            const errorProposal = createProposalFromError(proposal, err)
            if (errorProposal) {
                proposals[event.id] = errorProposal
            }
        }
    }
    return proposals
}
