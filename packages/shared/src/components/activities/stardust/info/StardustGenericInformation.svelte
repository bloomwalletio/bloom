<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { StardustActivity, StardustActivityAsyncStatus } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { time } from '@core/app/stores'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { buildUrl } from '@core/utils'
    import { getTimeDifference } from '@core/utils/time'
    import { NetworkLabel, ExpiredActivityPill, TimelockActivityPill, UnclaimedActivityPill } from '@ui'

    export let activity: StardustActivity

    $: claimedTime = activity.asyncData?.claimedDate ? getFormattedTimeStamp(activity.asyncData.claimedDate) : undefined
    $: gasLimit = activity.smartContract?.gasLimit

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
    $: formattedStorageDeposit = formatAmount(activity.storageDeposit ?? BigInt(0))

    $: formattedMaxGasFee = formatAmount(BigInt(gasLimit ?? 0))
    $: formattedTransactionFee = formatAmount(activity.transactionFee ?? BigInt(0))

    $: explorer = getDefaultExplorerUrl(activity.sourceNetworkId, ExplorerEndpoint.Transaction) ?? ''
    function onTransactionIdClick(): void {
        const url = buildUrl({
            origin: explorer.baseUrl,
            pathname: `${explorer.endpoint}/${activity.asyncData?.claimingTransactionId}`,
        })
        openUrlInBrowser(url?.href)
    }

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
                activity.asyncData?.timelockDate &&
                activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Timelocked
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
                activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Expired
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
                activity.asyncData?.asyncStatus !== StardustActivityAsyncStatus.Expired &&
                activity.asyncData?.asyncStatus !== StardustActivityAsyncStatus.Claimed &&
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
            onClick: explorer.baseUrl ? onTransactionIdClick : undefined,
        },
    ]}
/>
