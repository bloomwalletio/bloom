<script lang="ts">
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { IKeyValueBoxList } from '@core/utils'
    import { GovernanceAction, GovernanceActivity, formatTokenAmountBestMatch } from '@core/wallet'
    import { KeyValueBox } from '@ui'

    export let activity: GovernanceActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity.votingPower !== undefined && {
            votingPower: {
                data: formatTokenAmountBestMatch(activity.votingPower, getBaseToken(), 2),
                alternateKey:
                    activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
                    activity.governanceAction === GovernanceAction.IncreaseVotingPower
                        ? 'newVotingPower'
                        : 'votingPower',
            },
        }),
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${value.alternateKey ?? key}`)} valueText={value.data} />
{/each}
