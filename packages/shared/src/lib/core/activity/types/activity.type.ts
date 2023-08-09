import {
    AliasActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    TransactionActivity,
} from './'

export type Activity =
    | TransactionActivity
    | AliasActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
