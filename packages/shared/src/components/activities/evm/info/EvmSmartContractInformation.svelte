<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmContractCallActivity, EvmTokenTransferActivity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { ExplorerEndpoint, getDefaultExplorerUrl } from '@core/network'
    import { buildUrl } from '@core/utils'

    export let activity: EvmContractCallActivity | EvmTokenTransferActivity

    $: explorer = getDefaultExplorerUrl(activity.destinationNetworkId, ExplorerEndpoint.Address)
    function onExplorerClick(address: string): void {
        const url = buildUrl({ origin: explorer.baseUrl, pathname: `${explorer.endpoint}/${address}` })
        openUrlInBrowser(url?.href)
    }
</script>

<Table
    items={[
        {
            key: localize('general.contractAddress'),
            value: activity.contractAddress || undefined,
            onClick: () => onExplorerClick(activity.contractAddress ?? ''),
        },
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
