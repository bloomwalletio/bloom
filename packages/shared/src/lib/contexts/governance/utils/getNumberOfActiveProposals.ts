import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '../stores'
import { isProposalActive } from './isProposalActive'
import { getProposalWithStatus } from '@contexts/governance'
import { getStardustNetwork } from '@core/network'

export function getNumberOfActiveProposals(): number {
    const proposals = get(registeredProposalsForSelectedAccount)
    const currentMilestone = get(getStardustNetwork().currentMilestone)
    const activeProposals = Object.values(proposals ?? {}).filter((proposal) => {
        const { status } = getProposalWithStatus(proposal, currentMilestone)
        return isProposalActive(status)
    })
    return activeProposals.length
}
