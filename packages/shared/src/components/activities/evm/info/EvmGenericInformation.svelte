<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { NetworkId, getNetwork } from '@core/network'
    import { formatTokenAmount } from '@core/token'
    import { NetworkLabel } from '@ui'

    export let time: Date
    export let sourceNetworkId: NetworkId
    export let destinationNetworkId: NetworkId
    export let maxGasFee: bigint | undefined = undefined
    export let transactionFee: bigint | undefined = undefined

    $: formattedTransactionTime = getFormattedTimeStamp(time)

    $: formattedMaxGasFee = formatAmount(maxGasFee)
    $: formattedTransactionFee = formatAmount(transactionFee)

    function formatAmount(amount: bigint | undefined): string | undefined {
        return amount ? formatTokenAmount(amount, getNetwork(sourceNetworkId)?.baseToken) : undefined
    }
</script>

<Table
    items={[
        {
            key: localize('general.destinationNetwork'),
            slot: {
                component: NetworkLabel,
                props: {
                    networkId: destinationNetworkId,
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
    ]}
/>
