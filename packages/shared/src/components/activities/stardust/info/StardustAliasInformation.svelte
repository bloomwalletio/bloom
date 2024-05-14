<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { StardustAliasActivity } from '@core/activity'
    import { getExplorerUrl } from '@core/network/utils'
    import { ExplorerEndpoint } from '@core/network/enums'
    import { openUrlInBrowser } from '@core/app/utils'

    export let activity: StardustAliasActivity

    function onAddressClick(address: string) {
        const url = getExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
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
