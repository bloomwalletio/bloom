<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { StardustActivity } from '@core/activity'

    export let activity: StardustActivity
</script>

<Table
    items={[
        {
            key: localize('general.targetContract'),
            value: activity?.smartContract?.targetContract,
            copyable: true,
        },
        {
            key: localize('general.contractFunction'),
            value: activity?.smartContract?.contractFunction,
            copyable: true,
        },
    ]}
/>
