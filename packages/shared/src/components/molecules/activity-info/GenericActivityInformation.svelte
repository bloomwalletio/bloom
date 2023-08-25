<script lang="ts">
    import { type IItems, Table } from '@bloomwalletio/ui'
    import { Activity } from '@core/activity'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { openUrlInBrowser } from '@core/app'
    import { getBaseToken } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmountPrecise } from '@core/token'
    import { setClipboard, truncateString } from '@core/utils'
    import { KeyValueBox } from '@ui'

    export let activity: Activity

    const explorerUrl = getDefaultExplorerUrl($activeProfile?.network?.id)

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

    function onTransactionIdClick(): void {
        explorerUrl
            ? openUrlInBrowser(
                  `${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity?.asyncData?.claimingTransactionId}`
              )
            : setClipboard(activity?.asyncData?.claimingTransactionId)
    }

    let items: IItems[] = []

    $: setItems(activity)

    function setItems(activity: Activity): void {
        items = []

        if (activity?.destinationNetwork) {
            items.push({
                key: localize('general.destinationNetwork'),
                value: activity?.destinationNetwork,
            })
        }
        if (activity?.time) {
            items.push({
                key: localize('general.transactionTime'),
                value: formattedTransactionTime,
            })
        }
        if (activity?.tag) {
            items.push({
                key: localize('general.tag'),
                value: activity?.tag,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.tag`),
                },
            })
        }
        if (activity?.metadata) {
            items.push({
                key: localize('general.metadata'),
                value: activity?.metadata,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.metadata`),
                },
            })
        }
        if (hasStorageDeposit) {
            items.push({
                key: localize('general.storageDeposit'),
                value: formattedStorageDeposit,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.storageDeposit`),
                },
            })
        }
        if (activity?.surplus) {
            items.push({
                key: localize('general.surplus'),
                value: formattedSurplus,
            })
        }
        if (activity?.giftedStorageDeposit) {
            items.push({
                key: localize('general.giftedStorageDeposit'),
                value: formattedGiftedStorageDeposit,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.giftedStorageDeposit`),
                },
            })
        }
        if (gasLimit) {
            items.push({
                key: localize('general.gasLimit'),
                value: formattedGasLimit,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.gasLimit`),
                },
            })
        }
        if (expirationTime) {
            items.push({
                key: localize('general.expirationTime'),
                value: expirationTime,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.expirationTime`),
                },
            })
        }
        if (activity?.asyncData?.timelockDate) {
            items.push({
                key: localize('general.timelockDate'),
                value: formattedTimelockDate,
                popover: {
                    content: localize(`tooltips.transactionDetails.${activity?.direction}.timelockDate`),
                },
            })
        }
        if (claimedTime) {
            items.push({
                key: localize('general.claimedTime'),
                value: claimedTime,
            })
        }
    }
</script>

<Table {items} />
{#if activity?.asyncData?.claimingTransactionId}
    <KeyValueBox keyText={localize(activity?.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn')}>
        <button
            slot="value"
            class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={onTransactionIdClick}
        >
            {truncateString(activity?.asyncData?.claimingTransactionId, 12, 12)}
        </button>
    </KeyValueBox>
{/if}
