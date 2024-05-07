<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmount } from '@core/token'
    import { StardustGovernanceAction, StardustGovernanceActivity } from '@core/activity'

    export let activity: StardustGovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity?.time)
    $: isNewVotingPower =
        activity?.governanceAction === StardustGovernanceAction.DecreaseVotingPower ||
        activity?.governanceAction === StardustGovernanceAction.IncreaseVotingPower
</script>

<Table
    items={[
        {
            key: localize('general.transactionTime'),
            value: formattedTransactionTime,
        },
        {
            key: isNewVotingPower ? localize('general.newVotingPower') : localize('general.votingPower'),
            value:
                activity?.votingPower !== undefined
                    ? formatTokenAmount(activity?.votingPower, getBaseToken())
                    : undefined,
        },
    ]}
/>
