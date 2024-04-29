import { EventStatus, ParticipationEventWithNodes, VotingEventPayload } from '@iota/sdk/out/types'
import { IProposal } from '../interfaces'
import { ProposalType } from '../enums'
import { DEFAULT_NODE_URLS } from '@core/network/constants'
import { getActiveNetworkId } from '@core/network/actions'

export function createProposalFromEvent(event: ParticipationEventWithNodes): IProposal {
    const { data, id } = event

    const networkId = getActiveNetworkId()
    const officialNodeUrls = networkId ? DEFAULT_NODE_URLS[networkId] ?? [] : []
    const nodeUrl = event.nodes[0].url
    const isOfficialNetwork = officialNodeUrls.includes(nodeUrl)

    const milestones = {
        [EventStatus.Upcoming]: 0, // TODO: fix this
        [EventStatus.Commencing]: data.milestoneIndexCommence,
        [EventStatus.Holding]: data.milestoneIndexStart,
        [EventStatus.Ended]: data.milestoneIndexEnd,
    }

    const proposal: IProposal = {
        id,
        title: event.data.name,
        nodeUrl,
        questions: (data.payload as VotingEventPayload)?.questions,
        additionalInfo: data.additionalInfo,
        milestones,
        type: isOfficialNetwork ? ProposalType.Official : ProposalType.Custom,
    }
    return proposal
}
