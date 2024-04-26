import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '../stores'
import { isProposalActive } from './isProposalActive'
import { getProposalWithStatus } from '@contexts/governance'
import { getL1Network } from '@core/network'

export function getNumberOfActiveProposals(): number {
    const proposals = get(registeredProposalsForSelectedAccount)
    const { currentMilestone } = getL1Network()
    const activeProposals = Object.values(proposals ?? {}).filter((proposal) => {
        const { status } = getProposalWithStatus(proposal, get(currentMilestone))
        return isProposalActive(status)
    })
    return activeProposals.length
}
