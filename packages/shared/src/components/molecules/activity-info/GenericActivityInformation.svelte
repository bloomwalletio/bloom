<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
    import { Activity } from '@core/activity'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'

    export let activity: Activity

    $: expirationTime = activity?.asyncData?.expirationDate
        ? getFormattedTimeStamp(activity?.asyncData?.expirationDate)
        : undefined
    $: claimedTime = activity?.asyncData?.claimedDate
        ? getFormattedTimeStamp(activity?.asyncData?.claimedDate)
        : undefined
    $: hasStorageDeposit = activity?.storageDeposit
    $: gasFee = activity?.parsedLayer2Metadata?.gasLimit || activity?.gasUsed

    $: formattedTransactionTime = getFormattedTimeStamp(activity.time)
    $: formattedTimelockDate = activity.asyncData ? getFormattedTimeStamp(activity.asyncData?.timelockDate) : undefined
    $: formattedStorageDeposit = formatTokenAmountPrecise(activity.storageDeposit ?? 0, getBaseToken())
    $: formattedGasFee = formatTokenAmountPrecise(Number(gasFee ?? 0), getBaseToken())

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
        if (gasFee) {
            items.push({
                key: localize('general.gasFee'),
                value: formattedGasFee,
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
