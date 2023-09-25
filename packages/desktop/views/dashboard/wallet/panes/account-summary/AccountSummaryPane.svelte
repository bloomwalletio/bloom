<script lang="ts">
    import { Pane } from '@ui'
    import { AccountEvmChainSummary, AccountStardustNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { getActiveNetworkId, network } from '@core/network'

    export let account: IAccountState

    const stardustNetworkId = getActiveNetworkId()
    const evmChainNetworkId = $network.getChains()[0].getConfiguration().id
</script>

<Pane
    classes="w-full flex flex-row shrink-0 justify-between items-center border border-solid border-gray-100 shadow-lg"
>
    <AccountSummary {account} {stardustNetworkId} {evmChainNetworkId} />
    <div class="middle w-full">
        <AccountStardustNetworkSummary {account} networkId={stardustNetworkId} />
    </div>
    <AccountEvmChainSummary {account} networkId={evmChainNetworkId} />
</Pane>

<style lang="postcss">
    .middle {
        border-left: 1px solid #f1eef9;
        border-right: 1px solid #f1eef9;
    }
</style>
