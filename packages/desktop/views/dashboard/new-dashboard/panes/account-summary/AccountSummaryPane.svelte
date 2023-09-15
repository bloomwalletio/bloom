<script lang="ts">
    import { Pane } from '@ui'
    import { AccountEvmChainSummary, AccountStardustNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { getActiveNetworkId, SupportedNetworkId } from '@core/network'
    import { marketCoinPrices } from '@core/market/stores'

    export let account: IAccountState

    $: $marketCoinPrices
</script>

<Pane classes="w-full flex flex-row shrink-0 justify-between items-center border border-solid border-gray-100">
    <AccountSummary {account} />
    <div class="middle w-full">
        <AccountStardustNetworkSummary {account} networkId={getActiveNetworkId()} />
    </div>
    <AccountEvmChainSummary {account} networkId={SupportedNetworkId.ShimmerEvmTestnet} />
</Pane>

<style lang="postcss">
    .middle {
        border-left: 1px solid #f1eef9;
        border-right: 1px solid #f1eef9;
    }
</style>
