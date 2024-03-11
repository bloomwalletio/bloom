<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { StardustConsolidationActivity } from '@core/activity'

    export let activity: StardustConsolidationActivity
</script>

<Table
    items={[
        {
            key: localize('general.transactionTime'),
            value: activity?.time ? getFormattedTimeStamp(activity?.time) : undefined,
        },
        {
            key: localize('general.amountConsolidatedInputs'),
            value: activity?.amountConsolidatedInputs ? String(activity?.amountConsolidatedInputs) : undefined,
        },
    ]}
/>
