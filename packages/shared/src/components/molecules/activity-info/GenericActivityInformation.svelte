<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getNameFromNetworkId } from '@core/network'
    import { Activity } from '@core/activity'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'

    export let activity: Activity

    $: expirationTime = getFormattedTimeStamp(activity?.asyncData?.expirationDate)
    $: claimedTime = getFormattedTimeStamp(activity?.asyncData?.claimedDate)
    $: hasStorageDeposit =
        activity?.storageDeposit || (activity?.storageDeposit === 0 && activity?.giftedStorageDeposit === 0)
    $: gasLimit = activity?.parsedLayer2Metadata?.gasLimit

    $: formattedTransactionTime = getFormattedTimeStamp(activity?.time)
    $: formattedTimelockDate = getFormattedTimeStamp(activity?.asyncData?.timelockDate)
    $: formattedStorageDeposit = formatTokenAmountPrecise(activity?.storageDeposit ?? 0, getBaseToken())
    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(activity?.giftedStorageDeposit ?? 0, getBaseToken())
    $: formattedSurplus = formatTokenAmountPrecise(activity?.surplus ?? 0, getBaseToken())
    $: formattedGasLimit = formatTokenAmountPrecise(Number(gasLimit ?? 0), getBaseToken())
</script>

<Table
    items={[
        {
            key: localize('general.destinationNetwork'),
            value: getNameFromNetworkId(activity?.destinationNetworkId),
        },
        {
            key: localize('general.transactionTime'),
            value: formattedTransactionTime,
        },
        {
            key: localize('general.tag'),
            value: activity?.tag,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.tag`),
        },
        {
            key: localize('general.metadata'),
            value: activity?.metadata,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.metadata`),
        },
        {
            key: localize('general.storageDeposit'),
            value: hasStorageDeposit ? formattedStorageDeposit : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.storageDeposit`),
        },
        {
            key: localize('general.surplus'),
            value: activity?.surplus ? formattedSurplus : undefined,
        },
        {
            key: localize('general.giftedStorageDeposit'),
            value: activity?.giftedStorageDeposit ? formattedGiftedStorageDeposit : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.giftedStorageDeposit`),
        },
        {
            key: localize('general.gasLimit'),
            value: gasLimit ? formattedGasLimit : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.gasLimit`),
        },
        {
            key: localize('general.expirationTime'),
            value: expirationTime,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.expirationTime`),
        },
        {
            key: localize('general.timelockDate'),
            value: activity?.asyncData?.timelockDate ? formattedTimelockDate : undefined,
            tooltip: localize(`tooltips.transactionDetails.${activity?.direction}.timelockDate`),
        },
        {
            key: localize('general.claimedTime'),
            value: claimedTime,
        },
        {
            key: localize(activity?.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn'),
            value: activity?.asyncData?.claimingTransactionId,
            copyable: true,
            truncate: { firstCharCount: 12, endCharCount: 12 },
        },
    ]}
/>
