<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint, NetworkId, getDefaultExplorerUrl } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { buildUrl } from '@core/utils'
    import { NetworkLabel } from '@ui'

    export let time: Date
    export let destinationNetworkId: NetworkId
    export let maxGasFee: bigint | undefined = undefined
    export let transactionFee: bigint | undefined = undefined
    export let contractAddress: string | undefined = undefined

    $: formattedTransactionTime = getFormattedTimeStamp(time)

    $: formattedMaxGasFee = formatAmount(maxGasFee)
    $: formattedTransactionFee = formatAmount(transactionFee)

    function formatAmount(amount: bigint | undefined): string | undefined {
        return amount ? formatTokenAmountBestMatch(amount, getBaseToken()) : undefined
    }

    $: explorer = getDefaultExplorerUrl(destinationNetworkId, ExplorerEndpoint.Address)
    function onExplorerClick(address: string): void {
        const url = buildUrl({ origin: explorer.baseUrl, pathname: `${explorer.endpoint}/${address}` })
        openUrlInBrowser(url?.href)
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
            key: localize('general.contractAddress'),
            value: contractAddress || undefined,
            onClick: () => onExplorerClick(contractAddress ?? ''),
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
