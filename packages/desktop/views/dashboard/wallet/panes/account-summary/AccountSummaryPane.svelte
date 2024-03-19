<script lang="ts">
    import { Pane } from '@ui'
    import { AccountEvmChainSummary, AccountStardustNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { getActiveNetworkId, network } from '@core/network'

    export let account: IAccountState

    const stardustNetworkId = getActiveNetworkId()
    const chains = $network.getChains()
</script>

<Pane
    classes="
        w-full flex shrink-0 grid {chains.length > 0 ? chains.length > 1 ? 'grid-cols-4' : 'grid-cols-3' : 'grid-cols-2'}
        bg-surface dark:bg-surface-dark 
        border border-solid border-stroke dark:border-stroke-dark 
        divide-x divide-solid divide-stroke dark:divide-stroke-dark 
        shadow-lg
    "
>
    <AccountSummary />
    <AccountStardustNetworkSummary {account} networkId={stardustNetworkId} />
    {#each chains as chain}
        <AccountEvmChainSummary {account} {chain} />
    {/each}
</Pane>
