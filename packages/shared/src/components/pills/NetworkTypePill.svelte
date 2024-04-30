<script lang="ts">
    import { NetworkType, NetworkId, getActiveNetworkId, getEvmNetwork } from '@core/network'
    import { Pill, Tooltip } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let networkId: NetworkId

    let anchor: HTMLDivElement
</script>

{#if networkId !== getActiveNetworkId()}
    {@const chainType = getEvmNetwork(networkId)?.type}
    <network-type-pill bind:this={anchor} class="h-fit">
        <Pill color="cyan" compact>
            {chainType === NetworkType.Evm ? 'EVM' : chainType === NetworkType.Isc ? 'ISC' : undefined}
        </Pill>
    </network-type-pill>
    <Tooltip
        {anchor}
        placement="top"
        event="hover"
        text={chainType === NetworkType.Evm
            ? 'Ethereum'
            : chainType === NetworkType.Isc
              ? 'IOTA Smart Contracts'
              : localize('views.dashboard.network.undefined')}
    />
{/if}
