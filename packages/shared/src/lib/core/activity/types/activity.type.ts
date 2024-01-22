import {
    AliasActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    SmartContractActivity,
    TransactionActivity,
} from './'

export type Activity =
    | TransactionActivity
    | AliasActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
    | SmartContractActivity
