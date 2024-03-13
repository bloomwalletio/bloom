import {
    StardustAliasActivity,
    StardustConsolidationActivity,
    StardustFoundryActivity,
    StardustGovernanceActivity,
    StardustNftActivity,
    StardustTransactionActivity,
} from '..'

export type StardustActivity =
    | StardustTransactionActivity
    | StardustAliasActivity
    | StardustFoundryActivity
    | StardustNftActivity
    | StardustGovernanceActivity
    | StardustConsolidationActivity
