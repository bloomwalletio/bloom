<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { EvmActivity } from '@core/activity'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getEvmNetwork, getNetwork } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'

    export let activity: EvmActivity

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)

    $: formattedMaxGasFee = formatAmount(activity.maxGasFee)
    $: formattedTransactionFee = formatAmount(activity.transactionFee)

    function formatAmount(amount: bigint | undefined): string | undefined {
        return amount ? formatTokenAmount(amount, getNetwork(activity.sourceNetworkId)?.baseToken) : undefined
    }

    const { blocksUntilConfirmed } = getEvmNetwork(activity.sourceNetworkId) ?? { blocksUntilConfirmed: 0 }

    $: isConfirmed = activity.confirmations >= blocksUntilConfirmed
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
            key: localize('filters.status.label'),
            value: isConfirmed
                ? localize('filters.status.confirmed')
                : `${localize('filters.status.pending')}:  ${activity.confirmations}/${blocksUntilConfirmed}`,
        },
    ]}
/>
