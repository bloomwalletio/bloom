<script lang="ts">
    import { Pane } from '@ui'
    import { AccountNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { networks } from '@core/network'

    export let account: IAccountState
</script>

<Pane
    classes="
        w-full flex shrink-0 grid {$networks?.length && $networks.length > 1 ? 'grid-cols-3' : 'grid-cols-2'}
        bg-surface dark:bg-surface-dark
        border border-solid border-stroke dark:border-stroke-dark
        divide-x divide-solid divide-stroke dark:divide-stroke-dark
        shadow-lg
    "
>
    <AccountSummary />
    {#if $networks}
        <AccountNetworkSummary {account} network={$networks[0]} />
        {#if $networks[1]}
            <AccountNetworkSummary {account} network={$networks[1]} />
        {/if}
    {/if}
</Pane>
