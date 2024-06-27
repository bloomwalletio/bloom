<script lang="ts">
    import { Pane } from '@ui'
    import { AccountNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { networks } from '@core/network'

    export let account: IAccountState
</script>

<Pane
    classes="
        w-full flex shrink-0 flex
        bg-surface dark:bg-surface-dark
        border border-solid border-stroke dark:border-stroke-dark
        divide-x divide-solid divide-stroke dark:divide-stroke-dark
        shadow-lg
    "
>
    <AccountSummary />
    {#each $networks as network}
        <AccountNetworkSummary {account} {network} />
    {/each}
</Pane>
