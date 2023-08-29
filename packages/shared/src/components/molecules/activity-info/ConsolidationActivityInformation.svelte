<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { ConsolidationActivity } from '@core/activity'

    export let activity: ConsolidationActivity
</script>

<Table
    items={[
        {
            key: localize('general.transactionTime'),
            value: activity.time ? getFormattedTimeStamp(activity.time) : undefined,
        },
        {
            key: localize('general.amountConsolidatedInputs'),
            value: activity.amountConsolidatedInputs ? String(activity.amountConsolidatedInputs) : undefined,
        },
    ]}
/>
