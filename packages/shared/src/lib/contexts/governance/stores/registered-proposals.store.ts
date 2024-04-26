import { selectedAccountIndex } from '@core/account/stores'
import { derived, Readable, writable } from 'svelte/store'
import { IProposal, IRegisteredProposals } from '../interfaces'

export const registeredProposals = writable<{ [accountId: number]: IRegisteredProposals }>({})

export const registeredProposalsForSelectedAccount: Readable<IRegisteredProposals> = derived(
    [selectedAccountIndex, registeredProposals],
    ([$selectedAccountIndex, $registeredProposals]) => {
        if ($selectedAccountIndex >= 0) {
            return $registeredProposals[$selectedAccountIndex] ?? {}
        } else {
            return {}
        }
    }
)

export function addOrUpdateProposalToRegisteredProposals(proposal: IProposal, accountId: number): void {
    registeredProposals.update((proposals) => {
        if (!proposals[accountId]) {
            proposals[accountId] = {}
        }

        proposals[accountId][proposal.id] = proposal
        return proposals
    })
}

export function removePersistedProposal(proposalId: string | undefined, accountId: number): void {
    if (!proposalId) {
        return
    }
    registeredProposals.update((proposals) => {
        delete proposals[accountId][proposalId]
        return proposals
    })
}

export function resetRegisteredProposals(): void {
    registeredProposals.set({})
}
