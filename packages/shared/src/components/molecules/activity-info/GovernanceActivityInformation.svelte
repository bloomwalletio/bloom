<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { GovernanceAction, GovernanceActivity } from '@core/activity'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    let items: IItem[] = []

    $: setItems(activity)

    function setItems(activity: GovernanceActivity): void {
        items = []

        if (activity.time) {
            items.push({
                key: localize('general.transactionTime'),
                value: formattedTransactionTime,
            })
        }
        if (activity.votingPower !== undefined) {
            const isNewVotingPower =
                activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
                activity.governanceAction === GovernanceAction.IncreaseVotingPower
            items.push({
                key: isNewVotingPower ? localize('general.newVotingPower') : localize('general.votingPower'),
                value: formatTokenAmountBestMatch(activity.votingPower, getBaseToken(), 2),
                tooltip: localize('tooltips.transactionDetails.votingPower'),
            })
        }
    }
</script>

<Table {items} />
