<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmContractCallActivity, EvmTokenTransferActivity } from '@core/activity'

    export let activity: EvmContractCallActivity | EvmTokenTransferActivity
</script>

<Table
    items={[
        {
            key: localize('general.verified'),
            value: activity.verified ? localize('general.yes') : localize('general.no'),
        },
        {
            key: localize('general.methodName'),
            value: activity.method,
        },
        {
            key: localize('general.methodId'),
            value: !activity.method ? activity.methodId : undefined,
        },
        {
            key: localize('general.inputs'),
            value: activity.parameters,
        },
        {
            key: localize('general.data'),
            value: activity.rawData,
            copyable: true,
        },
    ]}
/>
