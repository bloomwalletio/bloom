import { IProposalFilter } from '@contexts/governance/interfaces/proposal-filter.interface'
import { ActivityFilter } from '@core/activity/types/activity-filter.interface'
import { AssetFilter } from '@core/wallet/interfaces/asset-filter.interface'

export type Filter = ActivityFilter | AssetFilter | IProposalFilter
