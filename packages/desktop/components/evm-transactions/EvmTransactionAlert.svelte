<script lang="ts">
    import { openUrlInBrowser } from '@core/app/utils'
    import { EvmNetworkId, ExplorerEndpoint, getExplorerUrl } from '@core/network'
    import { Alert, Link, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let variant: string | undefined = undefined
    export let message: string
    export let networkId: EvmNetworkId
    export let contractAddress: string

    function onExplorerClick(address: string): void {
        const url = getExplorerUrl(networkId, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }
</script>

<Alert {variant}>
    <Text slot="text">
        {message}
        <Link
            on:click={() => onExplorerClick(contractAddress)}
            text={localize('popups.smartContractCall.viewSmartContract')}
        />
    </Text>
    <slot slot="body" />
</Alert>
