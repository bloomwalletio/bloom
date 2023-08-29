<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { GovernanceAction, GovernanceActivity } from '@core/activity'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
    $: isNewVotingPower =
        activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction === GovernanceAction.IncreaseVotingPower
</script>

<Table
    items={[
        {
            key: localize('general.transactionTime'),
            value: activity.time ? formattedTransactionTime : undefined,
        },
        {
            key: isNewVotingPower ? localize('general.newVotingPower') : localize('general.votingPower'),
            value:
                activity.votingPower !== undefined
                    ? formatTokenAmountBestMatch(activity.votingPower, getBaseToken(), 2)
                    : undefined,
            tooltip: localize('tooltips.transactionDetails.votingPower'),
        },
    ]}
/>
