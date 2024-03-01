import {
    AliasActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    SmartContractActivity,
    TransactionActivity,
} from '..'

export type StardustActivity =
    | TransactionActivity
    | AliasActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
    | SmartContractActivity
