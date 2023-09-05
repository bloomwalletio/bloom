<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { Activity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl, getNameFromNetworkId } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'

    export let activity: Activity

    $: expirationTime = getFormattedTimeStamp(activity.asyncData?.expirationDate)
    $: claimedTime = getFormattedTimeStamp(activity.asyncData?.claimedDate)
    $: gasLimit = activity.parsedLayer2Metadata?.gasLimit

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
    $: formattedTimelockDate = getFormattedTimeStamp(activity.asyncData?.timelockDate)
    $: formattedStorageDeposit = formatAmount(activity.storageDeposit ?? 0)

    $: formattedEstimatedGasFee = formatAmount(Number(gasLimit ?? 0))
    $: formattedMaxGasFee = formatAmount(Number(gasLimit ?? 0))
    $: formattedTransactionFee = formatAmount(Number(activity.transactionFee ?? 0))

    $: explorerUrl = getDefaultExplorerUrl(activity.sourceNetworkId, ExplorerEndpoint.Transaction)
    function onTransactionIdClick(): void {
        if (explorerUrl) {
            openUrlInBrowser(`${explorerUrl}/${activity.asyncData?.claimingTransactionId}`)
        }
    }

    function formatAmount(amount: number | undefined): string | undefined {
        if (!amount) {
            return undefined
        }

        return formatTokenAmountPrecise(amount, getBaseToken())
    }
</script>

<Table
    items={[
        {
            key: localize('general.destinationNetwork'),
            value: getNameFromNetworkId(activity.destinationNetworkId),
        },
        {
            key: localize('general.transactionTime'),
            value: formattedTransactionTime,
        },
        {
            key: localize('general.tag'),
            value: activity.tag,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.tag`),
        },
        {
            key: localize('general.metadata'),
            value: !activity.parsedLayer2Metadata ? activity.metadata : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.metadata`),
        },
        {
            key: localize('general.storageDeposit'),
            value: activity.storageDeposit ? formattedStorageDeposit : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.storageDeposit`),
        },
        {
            key: localize('general.gasLimit'),
            value: !formattedTransactionFee ? formattedEstimatedGasFee : undefined,
        },
        {
            key: localize('general.gasLimit'),
            value: !formattedTransactionFee ? formattedMaxGasFee : undefined,
        },
        {
            key: localize('general.transactionFee'),
            value: formattedTransactionFee,
        },
        {
            key: localize('general.expirationTime'),
            value: expirationTime,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.expirationTime`),
        },
        {
            key: localize('general.timelockDate'),
            value: activity.asyncData?.timelockDate ? formattedTimelockDate : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.timelockDate`),
        },
        {
            key: localize('general.claimedTime'),
            value: claimedTime,
        },
        {
            key: localize(activity.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn'),
            value: activity.asyncData?.claimingTransactionId,
            copyable: true,
            truncate: { firstCharCount: 12, endCharCount: 12 },
            onClick: explorerUrl ? onTransactionIdClick : undefined,
        },
    ]}
/>
