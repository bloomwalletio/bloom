<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { EvmActivity, InclusionState } from '@core/activity'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getNetwork } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'

    export let activity: EvmActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    $: formattedMaxGasFee = formatAmount(activity.maxGasFee)
    $: formattedTransactionFee = formatAmount(activity.transactionFee)

    function formatAmount(amount: bigint | undefined): string | undefined {
        return amount ? formatTokenAmount(amount, getNetwork(activity.sourceNetworkId)?.baseToken) : undefined
    }
</script>

<Table
    items={[
        {
            key: localize('general.destinationNetwork'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: activity.destinationNetworkId,
                },
            },
        },
        {
            key: localize('general.transactionTime'),
            value: formattedTransactionTime,
        },
        {
            key: localize('general.maxFees'),
            value: !formattedTransactionFee ? formattedMaxGasFee : undefined,
        },
        {
            key: localize('general.transactionFee'),
            value: formattedTransactionFee,
        },
        {
            key: localize('general.status'),
            value:
                activity.inclusionState === InclusionState.Confirmed
                    ? localize('general.confirmed')
                    : localize('general.pending'),
        },
    ]}
/>
