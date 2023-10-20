<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { Activity, ActivityAsyncStatus } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { time } from '@core/app/stores'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { getTimeDifference } from '@core/utils/time'
    import { NetworkLabel, ExpiredActivityPill, TimelockActivityPill, UnclaimedActivityPill } from '@ui'

    export let activity: Activity

    $: claimedTime = activity.asyncData?.claimedDate ? getFormattedTimeStamp(activity.asyncData.claimedDate) : undefined
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
            slot:
                activity.asyncData?.timelockDate && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
                    ? {
                          component: TimelockActivityPill,
                          props: {
                              direction: activity.direction,
                              timeDiff: activity.asyncData?.timelockDate
                                  ? getTimeDifference(activity.asyncData?.timelockDate, $time)
                                  : undefined,
                          },
                      }
                    : undefined,
        },
        {
            key: localize('general.expiration'),
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.expirationTime`),
            slot:
                activity.asyncData?.asyncStatus === ActivityAsyncStatus.Expired
                    ? {
                          component: ExpiredActivityPill,
                          props: {
                              direction: activity.direction,
                          },
                      }
                    : undefined,
        },
        {
            key: localize('general.expiration'),
            tooltip: localize(`tooltips.transactionDetails.${activity.direction}.expirationTime`),
            slot:
                activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Expired &&
                activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Claimed &&
                activity.asyncData?.expirationDate
                    ? {
                          component: UnclaimedActivityPill,
                          props: {
                              direction: activity.direction,
                              timeDiff: activity.asyncData?.expirationDate
                                  ? getTimeDifference(activity.asyncData?.expirationDate, $time)
                                  : undefined,
                          },
                      }
                    : undefined,
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
