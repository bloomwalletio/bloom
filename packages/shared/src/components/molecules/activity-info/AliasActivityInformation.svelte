<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { AliasActivity } from '@core/activity'

    export let activity: AliasActivity
</script>

<Table
    items={[
        {
            key: localize('general.aliasId'),
            value: activity.aliasId,
        },
        {
            key: localize('general.governorAddress'),
            value: activity.governorAddress,
        },
        {
            key: localize('general.stateControllerAddress'),
            value: activity.stateControllerAddress,
        },
    ]}
/>
