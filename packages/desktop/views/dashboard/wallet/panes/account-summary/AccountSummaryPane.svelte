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
    classes="
        w-full flex shrink-0 grid grid-cols-3 
        bg-surface dark:bg-surface-dark 
        border border-solid border-stroke dark:border-stroke-dark 
        divide-x divide-solid divide-stroke dark:divide-stroke-dark 
        shadow-lg
    "
>
    <AccountSummary {stardustNetworkId} {evmChainNetworkId} />
    <AccountStardustNetworkSummary {account} networkId={stardustNetworkId} />
    <AccountEvmChainSummary {account} networkId={evmChainNetworkId} />
</Pane>
