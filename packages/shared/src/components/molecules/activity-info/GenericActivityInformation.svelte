<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { Activity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { NetworkLabel } from '@ui'
    import ActivityAsyncStatusPill from '@ui/pills/ActivityAsyncStatusPill.svelte'

    export let activity: Activity

    $: claimedTime = getFormattedTimeStamp(activity.asyncData?.claimedDate)
    $: gasLimit = activity.smartContract?.gasLimit

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
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

        return formatTokenAmountBestMatch(amount, getBaseToken())
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
            key: localize('general.tag'),
            value: activity.tag,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.tag`),
        },
        {
            key: localize('general.metadata'),
            value: !activity.smartContract ? activity.metadata : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.metadata`),
        },
        {
            key: localize('general.storageDeposit'),
            value: activity.storageDeposit ? formattedStorageDeposit : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.storageDeposit`),
        },
        {
            key: localize('general.estimatedFee'),
            value: !formattedTransactionFee ? formattedEstimatedGasFee : undefined,
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
            key: localize('general.timelockDate'),
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.timelockDate`),
            slot: {
                component: ActivityAsyncStatusPill,
                props: {
                    activity,
                },
            },
        },
        {
            key: localize('general.expirationTime'),
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.expirationTime`),
            slot: {
                component: ActivityAsyncStatusPill,
                props: {
                    activity,
                },
            },
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
