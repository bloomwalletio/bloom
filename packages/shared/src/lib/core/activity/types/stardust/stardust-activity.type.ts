import {
    StardustAliasActivity,
    StardustConsolidationActivity,
    StardustFoundryActivity,
    StardustGovernanceActivity,
    StardustNftActivity,
    StardustSmartContractActivity,
    StardustTransactionActivity,
} from '..'

export type StardustActivity =
    | StardustTransactionActivity
    | StardustAliasActivity
    | StardustFoundryActivity
    | StardustNftActivity
    | StardustGovernanceActivity
    | StardustConsolidationActivity
    | StardustSmartContractActivity
