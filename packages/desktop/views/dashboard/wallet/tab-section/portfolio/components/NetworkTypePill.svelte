<script lang="ts">
    import { EvmNetworkType, getActiveNetworkId, getEvmNetwork } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { Pill, Tooltip } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let token: ITokenWithBalance

    let anchor: HTMLDivElement
</script>

{#if token.networkId !== getActiveNetworkId()}
    {@const chainType = getEvmNetwork(token.networkId)?.type}
    <network-type-pill bind:this={anchor} class="h-fit">
        <Pill color="cyan" compact>
            {chainType === EvmNetworkType.PureEvm ? 'EVM' : chainType === EvmNetworkType.Isc ? 'ISC' : undefined}
        </Pill>
    </network-type-pill>
    <Tooltip
        {anchor}
        placement="top"
        event="hover"
        text={chainType === EvmNetworkType.PureEvm
            ? 'Ethereum'
            : chainType === EvmNetworkType.Isc
              ? 'IOTA Smart Contracts'
              : localize('views.dashboard.network.undefined')}
    />
{/if}
