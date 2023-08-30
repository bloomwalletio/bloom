<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
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

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
    $: formattedTimelockDate = activity.asyncData ? getFormattedTimeStamp(activity.asyncData?.timelockDate) : undefined
    $: formattedStorageDeposit = formatTokenAmountPrecise(activity.storageDeposit ?? 0, getBaseToken())
    $: formattedGasLimit = formatTokenAmountPrecise(Number(gasLimit ?? 0), getBaseToken())
    $: formattedGasUsed = formatTokenAmountPrecise(Number(activity.gasUsed ?? 0), getBaseToken())

    let items: IItem[] = []

    $: setItems(activity)

    function setItems(_activity: Activity): void {
        items = []

        if (_activity?.destinationNetwork) {
            items.push({
                key: localize('general.destinationNetwork'),
                value: _activity?.destinationNetwork,
            })
        }
        if (_activity?.time) {
            items.push({
                key: localize('general.transactionTime'),
                value: formattedTransactionTime,
            })
        }
        if (_activity?.tag) {
            items.push({
                key: localize('general.tag'),
                value: _activity?.tag,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.tag`),
            })
        }
        if (_activity?.metadata) {
            items.push({
                key: localize('general.metadata'),
                value: _activity?.metadata,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.metadata`),
            })
        }
        if (hasStorageDeposit) {
            items.push({
                key: localize('general.storageDeposit'),
                value: formattedStorageDeposit,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.storageDeposit`),
            })
        }
        if (_activity?.gasUsed) {
            items.push({
                key: localize('general.gasUsed'),
                value: formattedGasUsed,
            })
        }
        if (gasLimit) {
            items.push({
                key: localize('general.gasLimit'),
                value: formattedGasLimit,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.gasLimit`),
            })
        }
        if (expirationTime) {
            items.push({
                key: localize('general.expirationTime'),
                value: expirationTime,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.expirationTime`),
            })
        }
        if (_activity?.asyncData?.timelockDate) {
            items.push({
                key: localize('general.timelockDate'),
                value: formattedTimelockDate,
                tooltip: localize(`tooltips.transactionDetails.${_activity?.direction}.timelockDate`),
            })
        }
        if (claimedTime) {
            items.push({
                key: localize('general.claimedTime'),
                value: claimedTime,
            })
        }
        if (_activity?.asyncData?.claimingTransactionId) {
            items.push({
                key: localize(activity?.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn'),
                value: _activity?.asyncData?.claimingTransactionId,
                copyable: true,
                truncate: { firstCharCount: 12, endCharCount: 12 },
            })
        }
    }
</script>

<Table {items} />
