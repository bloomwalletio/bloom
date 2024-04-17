import {
    NumberFilterOption,
    StatusFilterOption,
    InternalExternalOption,
    DateFilterOption,
    BooleanFilterOption,
} from '@core/utils/enums/filters'
import { ActivityDirection, ActivityTypeFilterOption } from '../enums'
import { ActivityFilter } from '../types'

export const DEFAULT_ACTIVITY_FILTER: ActivityFilter = {
    amount: {
        type: 'number',
        active: false,
        localeKey: 'filters.amount',
        selected: NumberFilterOption.Equal,
        choices: Object.values(NumberFilterOption),
        subunit: {
            type: 'single',
            amount: 0,
        },
    },
    token: {
        active: false,
        type: 'token',
        localeKey: 'filters.asset',
        selected: '',
    },
    status: {
        active: false,
        type: 'selection',
        localeKey: 'filters.status',
        selected: StatusFilterOption.Confirmed,
        choices: [
            StatusFilterOption.Confirmed,
            StatusFilterOption.Pending,
            StatusFilterOption.Timelocked,
            StatusFilterOption.Claimed,
            StatusFilterOption.Unclaimed,
        ],
    },
    type: {
        active: false,
        type: 'selection',
        localeKey: 'filters.type',
        selected: ActivityTypeFilterOption.Transfer,
        choices: [
            ActivityTypeFilterOption.Transfer,
            ActivityTypeFilterOption.Nft,
            ActivityTypeFilterOption.Alias,
            ActivityTypeFilterOption.Governance,
            ActivityTypeFilterOption.Foundry,
            ActivityTypeFilterOption.Consolidation,
            ActivityTypeFilterOption.SmartContract,
        ],
    },
    direction: {
        active: false,
        type: 'selection',
        localeKey: 'filters.direction',
        selected: ActivityDirection.Incoming,
        choices: [ActivityDirection.Incoming, ActivityDirection.Outgoing, ActivityDirection.SelfTransaction],
    },
    internalExternal: {
        active: false,
        type: 'selection',
        localeKey: 'filters.internalExternal',
        selected: InternalExternalOption.External,
        choices: [InternalExternalOption.External, InternalExternalOption.Internal],
    },
    date: {
        active: false,
        type: 'date',
        localeKey: 'filters.date',
        selected: DateFilterOption.Equals,
        choices: Object.values(DateFilterOption),
        subunit: {
            type: 'single',
            value: undefined,
        },
    },
    showRejected: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showRejected',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    showHidden: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showHidden',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    showSpam: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showSpam',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
}
