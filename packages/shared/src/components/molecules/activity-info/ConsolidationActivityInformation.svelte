<script lang="ts">
    import { type IItems, Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ConsolidationActivity } from '@core/activity'

    export let activity: ConsolidationActivity

    let items: IItems[] = []

    $: setItems(activity)

    function setItems(activity: ConsolidationActivity): void {
        items = []

        if (activity.time) {
            items.push({
                key: localize('general.transactionTime'),
                value: getFormattedTimeStamp(activity.time),
            })
        }
        if (activity.amountConsolidatedInputs) {
            items.push({
                key: localize('general.amountConsolidatedInputs'),
                value: String(activity.amountConsolidatedInputs),
            })
        }
    }
</script>

<Table {items} />
