<script lang="ts">
    import { ChainType, getActiveNetworkId, getChain } from '@core/network'
    import { ITokenWithBalance } from '@core/token'
    import { Pill, Tooltip } from '@bloomwalletio/ui'

    export let token: ITokenWithBalance

    let anchor: HTMLDivElement
</script>

{#if token.networkId !== getActiveNetworkId()}
    {@const chainType = getChain(token.networkId).type}
    <chain-type-pill bind:this={anchor} class="h-fit">
        <Pill color="cyan" compact>
            {chainType === ChainType.Evm ? 'EVM' : chainType === ChainType.Iscp ? 'ISC' : undefined}
        </Pill>
    </chain-type-pill>
    <Tooltip
        {anchor}
        placement="top"
        event="hover"
        text={chainType === ChainType.Evm
            ? 'Ethereum'
            : chainType === ChainType.Iscp
              ? 'IOTA Smart Contracts'
              : undefined}
    />
{/if}
