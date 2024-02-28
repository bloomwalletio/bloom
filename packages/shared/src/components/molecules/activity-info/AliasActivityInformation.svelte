<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { AliasActivity } from '@core/activity'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { ExplorerEndpoint } from '@core/network/enums'
    import { openUrlInBrowser } from '@core/app/utils'

    export let activity: AliasActivity

    function onAddressClick(address: string) {
        const explorerUrl = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Address)
        openUrlInBrowser(`${explorerUrl}/${address}`)
    }
</script>

<Table
    items={[
        {
            key: localize('general.aliasId'),
            value: activity.aliasId,
            onClick: () => onAddressClick(activity.aliasId),
        },
        {
            key: localize('general.governorAddress'),
            value: activity.governorAddress,
            onClick: () => onAddressClick(activity.governorAddress),
        },
        {
            key: localize('general.stateControllerAddress'),
            value: activity.stateControllerAddress,
            onClick: () => onAddressClick(activity.stateControllerAddress),
        },
    ]}
/>
