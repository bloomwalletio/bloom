<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { EvmContractCallActivity, EvmTokenMintingActivity, EvmTokenTransferActivity } from '@core/activity'
    import { openUrlInBrowser } from '@core/app'
    import { ExplorerEndpoint, getExplorerUrl } from '@core/network'

    export let activity: EvmContractCallActivity | EvmTokenTransferActivity | EvmTokenMintingActivity

    function onExplorerClick(address: string): void {
        const url = getExplorerUrl(activity.destinationNetworkId, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }
</script>

<Table
    items={[
        {
            key: localize('general.contract'),
            value: activity.contract?.address || localize('general.unknown'),
            onClick: activity.contract?.address ? () => onExplorerClick(activity.contract?.address ?? '') : undefined,
        },
        {
            key: localize('general.verified'),
            value:
                activity.contract?.verified !== undefined
                    ? activity.contract.verified
                        ? localize('general.yes')
                        : localize('general.no')
                    : activity.contract?.address
                      ? localize('general.unknown')
                      : undefined,
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
            value: activity.inputs,
        },
        {
            key: localize('general.data'),
            value: activity.rawData || undefined,
            copyable: true,
        },
    ]}
/>
