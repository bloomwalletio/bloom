<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { NetworkId } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { NetworkLabel } from '@ui'

    export let time: Date
    export let destinationNetworkId: NetworkId
    export let maxGasFee: bigint | undefined = undefined
    export let transactionFee: bigint | undefined = undefined

    $: formattedTransactionTime = getFormattedTimeStamp(time)

    $: formattedMaxGasFee = formatAmount(maxGasFee)
    $: formattedTransactionFee = formatAmount(transactionFee)

    function formatAmount(amount: bigint | undefined): string | undefined {
        return amount ? formatTokenAmountBestMatch(amount, getBaseToken()) : undefined
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
