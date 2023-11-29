import { EventStatus } from '@iota/sdk/out/types'
import { BooleanFilterOption, OrderOption } from '@core/utils/enums/filters'
import { ProposalOrderOption, ProposalType } from '../enums'
import { IProposalFilter } from '../interfaces'

export const DEFAULT_PROPOSAL_FILTER: IProposalFilter = {
    phase: {
        active: false,
        type: 'selection',
        labelKey: 'filters.phase.label',
        localeKey: 'pills.governance.proposalStatus',
        selected: EventStatus.Commencing,
        choices: [EventStatus.Commencing, EventStatus.Upcoming, EventStatus.Holding, EventStatus.Ended],
    },
    type: {
        active: false,
        type: 'selection',
        localeKey: 'filters.proposalType',
        selected: ProposalType.Official,
        choices: [ProposalType.Official, ProposalType.Custom],
    },
    participated: {
        active: false,
        type: 'selection',
        localeKey: 'filters.participated',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    order: {
        active: false,
        type: 'order',
        localeKey: 'filters.proposalOrder',
        selected: ProposalOrderOption.Name,
        ascDesc: OrderOption.Asc,
        choices: [ProposalOrderOption.Name, ProposalOrderOption.Phase],
    },
}
