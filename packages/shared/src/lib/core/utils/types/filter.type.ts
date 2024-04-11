import { IProposalFilter } from '@contexts/governance/interfaces/proposal-filter.interface'
import { ActivityFilter } from '@core/activity/types/activity-filter.interface'
import { INftFilter } from '@core/nfts/interfaces/nft-filter.interface'
import { TokenFilter } from '@core/token/interfaces/token-filter.interface'

export type Filter = ActivityFilter | TokenFilter | IProposalFilter | INftFilter
