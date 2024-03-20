import { IProposal } from '@contexts/governance/interfaces'
import { writable, Readable, derived } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from './registered-proposals.store'

export const selectedProposalId = writable<string>(undefined)

export const selectedProposal: Readable<IProposal> = derived(
    [selectedProposalId, registeredProposalsForSelectedAccount],
    ([$selectedProposalId, $registeredProposalsForSelectedAccount]) =>
        $registeredProposalsForSelectedAccount[$selectedProposalId]
)
